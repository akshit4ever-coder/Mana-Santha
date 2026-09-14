import test from 'node:test';
import assert from 'node:assert/strict';

import { isProductAvailable, isVariantAvailable, normalizeProductStatus } from './product-availability.ts';

test('normalizeProductStatus lowercases and trims status', () => {
  assert.equal(normalizeProductStatus(' Out of Stock '), 'out of stock');
  assert.equal(normalizeProductStatus('OUT OF STOCK'), 'out of stock');
  assert.equal(normalizeProductStatus('ACTIVE'), 'active');
  assert.equal(normalizeProductStatus('   '), '');
  assert.equal(normalizeProductStatus(null), '');
});

test('truth table enforces stock and status combined availability rule', () => {
  const cases = [
    { product: { stock: 50, status: 'active' }, expected: true },
    { product: { stock: 0, status: 'active' }, expected: false },
    { product: { stock: 50, status: 'Out of Stock' }, expected: false },
    { product: { stock: 0, status: 'out_of_stock' }, expected: false },
  ];

  for (const { product, expected } of cases) {
    assert.equal(isProductAvailable(product), expected, JSON.stringify(product));
  }
});

test('variant availability uses parent override and variant stock independently', () => {
  const product = {
    status: 'active',
    is_active: true,
    product_variants: [
      { id: 'v1', stock: 10, status: 'active', is_active: true },
      { id: 'v2', stock: 0, status: 'active', is_active: true },
      { id: 'v3', stock: 5, status: 'Out of Stock', is_active: true },
    ],
  };

  assert.equal(isProductAvailable(product), true);
  assert.equal(isVariantAvailable(product, product.product_variants[0]), true);
  assert.equal(isVariantAvailable(product, product.product_variants[1]), false);
  assert.equal(isVariantAvailable(product, product.product_variants[2]), false);

  const productInactive = {
    status: 'inactive',
    is_active: true,
    product_variants: [{ id: 'v4', stock: 999, status: 'active', is_active: true }],
  };

  assert.equal(isProductAvailable(productInactive), false);
  assert.equal(isVariantAvailable(productInactive, productInactive.product_variants[0]), false);
});

test('blank and missing status values are treated as unavailable', () => {
  assert.equal(isProductAvailable({ stock: 50, status: null }), false);
  assert.equal(isProductAvailable({ stock: 50, status: '' }), false);
  assert.equal(isProductAvailable({ stock: 50, status: ' ACTIVE ' }), true);
  assert.equal(isProductAvailable({ stock: 50, status: 'inactive' }), false);
  assert.equal(isProductAvailable({ stock: 50, status: 'OUT OF STOCK' }), false);
  assert.equal(isProductAvailable({ stock: 50, status: 'Out of Stock', is_active: true }), false);
});

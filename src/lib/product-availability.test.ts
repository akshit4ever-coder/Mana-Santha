import test from 'node:test';
import assert from 'node:assert/strict';

import { getCartItemAvailabilityState, getCartItemValidationDetail, isParentProductAvailable, isProductAvailable, isVariantAvailable, normalizeProductStatus, validateVariantAvailability } from './product-availability.ts';
import { getOrderCutoffStatus } from './delivery-cutoff.ts';

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

test('variant stock controls availability even when parent product stock is zero', () => {
  const product = {
    id: 'p-variant-zero-parent',
    status: 'active',
    is_active: true,
    stock: 0,
    product_variants: [
      { id: 'v-1', stock: 20, status: 'active', is_active: true, name: '250g' },
      { id: 'v-2', stock: 0, status: 'active', is_active: true, name: '500g' },
    ],
  };

  assert.equal(isProductAvailable(product), true);
  assert.equal(isVariantAvailable(product, product.product_variants[0]), true);
  assert.equal(isVariantAvailable(product, product.product_variants[1]), false);
  assert.equal(getCartItemValidationDetail({
    id: 'cart-variant-zero-parent',
    product_id: product.id,
    variant_id: 'v-1',
    quantity: 1,
    products: product,
    variant: product.product_variants[0],
  }).isAvailable, true);
});

test('simple product with no variants and active stock remains available', () => {
  const product = { id: 'p1', stock: 25, status: 'active', is_active: true };
  assert.equal(isProductAvailable(product), true);
  assert.equal(isVariantAvailable(product, undefined), true);
  assert.equal(isVariantAvailable(product, null), true);
});

test('missing status and is_active are treated as active defaults', () => {
  assert.equal(isProductAvailable({ stock: 50, status: null, is_active: null }), true);
  assert.equal(isProductAvailable({ stock: 50, status: '', is_active: null }), true);
  assert.equal(isParentProductAvailable({ stock: 50, status: null, is_active: null }), true);
});

test('variant product with no matching variant row is unavailable', () => {
  const product = {
    id: 'p2',
    status: 'active',
    is_active: true,
    stock: 10,
    product_variants: [{ id: 'v1', stock: 5, status: 'active', is_active: true }],
  };

  assert.equal(isVariantAvailable(product, { id: 'missing', stock: 0 }), false);
  assert.equal(isVariantAvailable(product, undefined), true);
});

test('only the out-of-stock variant is flagged when the same product has another active size', () => {
  const product = {
    id: 'p3',
    status: 'active',
    is_active: true,
    stock: 10,
    product_variants: [
      { id: 'v1', name: '1L', stock: 5, status: 'active', is_active: true },
      { id: 'v2', name: '2L', stock: 0, status: 'active', is_active: true },
    ],
  };

  assert.equal(isVariantAvailable(product, product.product_variants[0]), true);
  assert.equal(isVariantAvailable(product, product.product_variants[1]), false);
  assert.equal(isProductAvailable(product), true);
});

test('blank and missing status values are treated as active defaults when stock is present', () => {
  assert.equal(isProductAvailable({ stock: 50, status: null }), true);
  assert.equal(isProductAvailable({ stock: 50, status: '' }), true);
  assert.equal(isProductAvailable({ stock: 50, status: ' ACTIVE ' }), true);
  assert.equal(isProductAvailable({ stock: 50, status: 'inactive' }), false);
  assert.equal(isProductAvailable({ stock: 50, status: 'OUT OF STOCK' }), false);
  assert.equal(isProductAvailable({ stock: 50, status: 'Out of Stock', is_active: true }), false);
});

test('variant fetch errors do not mark items unavailable, while confirmed missing variants do', () => {
  const fetchErrorItem = {
    variant_id: 'v-error',
    quantity: 2,
    variant_fetch_error: true,
    products: { id: 'p-1', stock: 25, status: 'active', is_active: true },
    variant: null,
  };

  assert.equal(getCartItemAvailabilityState(fetchErrorItem).isAvailable, false);
  assert.equal(getCartItemAvailabilityState(fetchErrorItem).hasVariantFetchError, true);

  const missingVariantItem = {
    variant_id: 'v-missing',
    quantity: 1,
    variant_fetch_error: false,
    variant_missing: true,
    products: { id: 'p-2', status: 'active', is_active: true, stock: 15, product_variants: [{ id: 'v-else', stock: 10, status: 'active', is_active: true }] },
    variant: null,
  };

  assert.equal(getCartItemAvailabilityState(missingVariantItem).isAvailable, false);
  assert.equal(getCartItemAvailabilityState(missingVariantItem).isMissingVariant, true);
});

test('variant validation separates fetch errors from genuine stock issues', () => {
  const product = { id: 'p-3', stock: 50, status: 'active', is_active: true };
  const activeVariant = { id: 'v-100', product_id: 'p-3', stock: 50, is_active: true, max_qty: 10, name: '50 ml' };
  const soldOutVariant = { id: 'v-101', product_id: 'p-3', stock: 0, is_active: true, max_qty: 10, name: '100 ml' };
  const inactiveVariant = { id: 'v-102', product_id: 'p-3', stock: 10, is_active: false, max_qty: 10, name: '250 ml' };

  assert.deepEqual(validateVariantAvailability(product, activeVariant, 1), { status: 'available', variant: activeVariant });
  assert.deepEqual(validateVariantAvailability(product, soldOutVariant, 1), { status: 'unavailable', reason: 'out_of_stock', variant: soldOutVariant });
  assert.deepEqual(validateVariantAvailability(product, inactiveVariant, 1), { status: 'unavailable', reason: 'inactive', variant: inactiveVariant });
  assert.deepEqual(validateVariantAvailability(product, undefined, 1), { status: 'missing', reason: 'variant_not_found' });
  assert.deepEqual(validateVariantAvailability(product, activeVariant, 100), { status: 'unavailable', reason: 'quantity_exceeded', variant: activeVariant });
  assert.deepEqual(validateVariantAvailability(product, activeVariant, 1), { status: 'available', variant: activeVariant });
});

test('combo cart items are available when the combo snapshot is active even without a product row', () => {
  const comboItem = {
    id: 'combo-cart-1',
    combo_id: 'combo-123',
    product_id: null,
    quantity: 1,
    combo_snapshot: {
      id: 'combo-123',
      name: 'todays combo',
      status: 'active',
      stock: null,
      offer_price: 199,
      price: 499,
    },
  };

  assert.equal(getCartItemAvailabilityState(comboItem).isAvailable, true);
  assert.equal(getCartItemValidationDetail(comboItem).isAvailable, true);
});

test('delivery cutoff uses IST and flips at 7:30 PM exactly', () => {
  const beforeCutoff = new Date('2026-09-15T18:45:00+05:30');
  const afterCutoff = new Date('2026-09-15T19:30:00+05:30');
  const beforeStatus = getOrderCutoffStatus(beforeCutoff);
  const afterStatus = getOrderCutoffStatus(afterCutoff);

  assert.equal(beforeStatus.isAfterCutoff, false);
  assert.equal(beforeStatus.deliveryDate.toISOString().slice(0, 10), '2026-09-15');
  assert.equal(afterStatus.isAfterCutoff, true);
  assert.equal(afterStatus.deliveryDate.toISOString().slice(0, 10), '2026-09-16');
});

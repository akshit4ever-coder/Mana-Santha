import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getCartRestrictionMessage,
  isRiceProductByClassification,
  isLargeOilVariantByClassification,
  validateRiceRule,
  canAddRiceProduct,
} from './cart-rules.ts';

test('rice detection uses actual category and subcategory data instead of name matching', () => {
  const product = {
    category_name: 'Rice',
    subcategory_name: 'Sona Masuri Rice',
    categories: { name: 'Rice', slug: 'rice' },
    subcategories: { name: 'Sona Masuri Rice', slug: 'sona-masuri-rice' },
    name: 'Sona Rice',
    brand: 'Eagle',
  };

  assert.equal(isRiceProductByClassification(product), true);
  assert.equal(isRiceProductByClassification({ category_name: 'Vegetables', subcategory_name: 'Leafy Vegetables' }), false);
});

test('rice limit blocks a second rice bag while allowing one', () => {
  const riceA = {
    id: 'rice-a',
    category_name: 'Rice',
    subcategory_name: 'Sona Masuri Rice',
    categories: { name: 'Rice', slug: 'rice' },
    subcategories: { name: 'Sona Masuri Rice', slug: 'sona-masuri-rice' },
    name: 'Sona Rice',
    brand: 'Eagle',
  };
  const riceB = {
    ...riceA,
    id: 'rice-b',
    name: 'Bell Sona Rice',
    brand: 'Golden Ding Dong BELL',
  };

  assert.equal(validateRiceRule([{ products: riceA, quantity: 1 }]).allowed, true);
  assert.equal(validateRiceRule([{ products: riceA, quantity: 1 }, { products: riceB, quantity: 1 }]).allowed, false);
  assert.equal(canAddRiceProduct([{ products: riceA, quantity: 1 }], riceB, 1).allowed, false);
});

test('large oil restriction uses variant quantity metadata and ignores smaller oils', () => {
  const largeOilVariant = { id: 'oil-15', name: '15 L', unit: null, quantity_value: null };
  const smallOilVariant = { id: 'oil-1', name: '1 L', unit: null, quantity_value: null };
  const oilProduct = {
    category_name: 'Edible Oils',
    subcategory_name: 'Groundnut Oils',
    name: 'A.S.Brand Groundnut Oil',
    brand: 'A.S.BRAND',
  };

  assert.equal(isLargeOilVariantByClassification(oilProduct, largeOilVariant), true);
  assert.equal(isLargeOilVariantByClassification(oilProduct, smallOilVariant), false);

  const cartItems = [
    { id: 'cart-1', product_id: 'oil-1', quantity: 1, products: oilProduct, variant_id: 'oil-15', variant: largeOilVariant },
  ];
  const blocked = getCartRestrictionMessage({ product: oilProduct, variant: { id: 'oil-15b', name: '15 Kg', unit: 'kg', quantity_value: 15 }, cartItems, quantity: 1 });
  assert.equal(blocked, 'ఒక్క కార్ట్‌కు ఒక 15L / 15Kg ఆయిల్ మాత్రమే అనుమతించబడుతుంది.');

  const allowed = getCartRestrictionMessage({ product: oilProduct, variant: smallOilVariant, cartItems, quantity: 1 });
  assert.equal(allowed, null);
});

test('rice detection does not misclassify rice-bran oil as rice when the actual category is oil', () => {
  const riceBranOilProduct = {
    category_name: 'Edible Oils',
    subcategory_name: 'Rice Bran Oil',
    categories: { name: 'Edible Oils', slug: 'edible-oils' },
    subcategories: { name: 'Rice Bran Oil', slug: 'rice-bran-oil' },
    name: 'Freedom Rice Bran Oil 5 L',
    brand: 'Freedom',
  };

  assert.equal(isRiceProductByClassification(riceBranOilProduct), false);
  assert.equal(getCartRestrictionMessage({
    product: riceBranOilProduct,
    variant: { id: 'v-5l', name: '5 L', unit: 'L', quantity_value: 5 },
    cartItems: [],
    quantity: 1,
  }), null);
});

export const FREE_DELIVERY_THRESHOLD = 499;
export const FREE_DELIVERY_FEE = 0;
export const DEFAULT_DELIVERY_FEE = 29;
export const RICE_LIMIT_MESSAGE = "ఒక్క కార్ట్‌కు ఒక రైస్ బ్యాగ్ మాత్రమే అనుమతించబడుతుంది.";
export const LARGE_OIL_LIMIT_MESSAGE = "ఒక్క కార్ట్‌కు ఒక 15L / 15Kg ఆయిల్ మాత్రమే అనుమతించబడుతుంది.";
export const COMBO_FREE_DELIVERY_MESSAGE = "నేటి కాంబోతో ఉచిత డెలివరీ";

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u0c00-\u0c7f]+/g, " ")
    .trim();
}

export function isComboCartItem(item: any): boolean {
  return Boolean(item?.combo_id || item?.combo_snapshot || item?.type === "combo");
}

export function getProductClassificationStrings(product: any): string[] {
  if (!product) return [];

  const categoryName = product?.categories?.name ?? product?.category_name ?? product?.category?.name ?? "";
  const categorySlug = product?.categories?.slug ?? product?.category_slug ?? product?.category?.slug ?? "";
  const subcategoryName = product?.subcategories?.name ?? product?.subcategory_name ?? product?.subcategory?.name ?? "";
  const subcategorySlug = product?.subcategories?.slug ?? product?.subcategory_slug ?? product?.subcategory?.slug ?? "";

  return [...new Set([
    categoryName,
    categorySlug,
    subcategoryName,
    subcategorySlug,
  ].map(normalizeText).filter(Boolean))];
}

function getProductClassificationText(product: any): string {
  return getProductClassificationStrings(product).join(" ");
}

export function isRiceProductByClassification(product: any): boolean {
  if (!product) return false;

  const classificationText = getProductClassificationText(product);
  return /(^|\s)rice(\s|$)|arisi|biyyam|basmati|sona masuri|pl rice|masoori|rice\b|\brice\b/.test(classificationText);
}

function normalizeOilUnitText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/\bkgs?\b/g, "kg")
    .replace(/\blitres?\b/g, "liter")
    .replace(/\bltrs?\b/g, "liter")
    .replace(/\bl\b/g, "l");
}

export function parseVariantQuantity(variant: any): { value: number; unit: string | null; label: string } | null {
  if (!variant) return null;

  const explicitValue = Number(variant?.quantity_value ?? NaN);
  const valueFromName = (() => {
    const match = String(variant?.name ?? variant?.option_name ?? "").match(/(\d+(?:\.\d+)?)\s*(l|kg|liter|litre|ltr|kgs)/i);
    return match ? Number(match[1]) : NaN;
  })();
  const value = Number.isFinite(explicitValue) ? explicitValue : Number.isFinite(valueFromName) ? valueFromName : NaN;
  const unit = normalizeOilUnitText(variant?.unit || (String(variant?.name ?? variant?.option_name ?? "").match(/(?:\d+(?:\.\d+)?)\s*([a-z]+)$/i)?.[1]) || "");

  if (!Number.isFinite(value) || value <= 0) return null;

  return {
    value,
    unit: unit || null,
    label: `${value} ${unit || ""}`.trim(),
  };
}

export function isLargeOilVariantByClassification(product: any, variant: any): boolean {
  const classificationText = getProductClassificationText(product || {});
  const isOilProduct = /(^|\s)oil(\s|$)|edible oils|groundnut|sunflower|mustard|cooking oil/.test(classificationText) || /oil/i.test(String(product?.name ?? ""));
  const quantityInfo = parseVariantQuantity(variant);

  if (!isOilProduct || !quantityInfo) return false;

  const unit = normalizeOilUnitText(quantityInfo.unit ?? "");
  const label = normalizeOilUnitText(quantityInfo.label);
  const isLarge = (quantityInfo.value === 15 && (unit === "l" || unit === "kg" || unit === "liter" || unit === "litre"))
    || /15\s*(l|liter|litre|kg)/i.test(label)
    || /15\s*(l|liter|litre|kg)/i.test(String(variant?.name ?? variant?.option_name ?? ""));

  return Boolean(isLarge);
}

export function getRiceQuantityForItem(item: any): number {
  if (!item) return 0;

  if (isComboCartItem(item)) {
    const comboItems = item?.combo_snapshot?.items ?? item?.combo_items ?? [];
    if (Array.isArray(comboItems) && comboItems.length > 0) {
      return comboItems.reduce((sum: number, comboItem: any) => {
        const product = comboItem?.product ?? comboItem?.products ?? comboItem?.product_details ?? null;
        return sum + (isRiceProductByClassification(product) ? Number(comboItem.quantity ?? 1) : 0);
      }, 0);
    }
    return 0;
  }

  const product = item?.products ?? item;
  if (!isRiceProductByClassification(product)) return 0;
  return Number(item?.quantity ?? 0);
}

export function getLargeOilQuantityForItem(item: any): number {
  if (!item || isComboCartItem(item)) return 0;
  const product = item?.products ?? item;
  const variant = item?.variant ?? null;
  if (!isLargeOilVariantByClassification(product, variant ?? item)) return 0;
  return Number(item?.quantity ?? 0);
}

export function getCartRiceQuantity(cartItems: any[] = []): number {
  return (cartItems ?? []).reduce((sum: number, item: any) => sum + getRiceQuantityForItem(item), 0);
}

export function getCartLargeOilQuantity(cartItems: any[] = []): number {
  return (cartItems ?? []).reduce((sum: number, item: any) => sum + getLargeOilQuantityForItem(item), 0);
}

export function getCartSubtotal(cartItems: any[] = []) {
  return (cartItems ?? []).reduce((sum: number, item: any) => {
    if (item?.variant_missing === true) return sum;
    const price = Number(item?.variant_price ?? item?.products?.price ?? item?.combo_snapshot?.offer_price ?? item?.combo_snapshot?.price ?? 0);
    return sum + price * Number(item?.quantity ?? 0);
  }, 0);
}

export function calculateDeliveryFee(cartItems: any[] = [], subtotalOverride?: number) {
  const subtotal = typeof subtotalOverride === "number" ? subtotalOverride : getCartSubtotal(cartItems);
  const hasCombo = (cartItems ?? []).some((item) => isComboCartItem(item));

  if (hasCombo) return FREE_DELIVERY_FEE;
  if (subtotal <= 0) return FREE_DELIVERY_FEE;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? FREE_DELIVERY_FEE : DEFAULT_DELIVERY_FEE;
}

export function getCartOrderSummary(cartItems: any[] = [], subtotalOverride?: number) {
  const subtotal = typeof subtotalOverride === "number" ? subtotalOverride : getCartSubtotal(cartItems);
  const deliveryFee = calculateDeliveryFee(cartItems, subtotal);
  const total = subtotal + deliveryFee;
  const hasCombo = (cartItems ?? []).some((item) => isComboCartItem(item));

  return {
    subtotal,
    deliveryFee,
    total,
    hasCombo,
    freeDeliveryLabel: hasCombo ? COMBO_FREE_DELIVERY_MESSAGE : "",
  };
}

export function validateRiceRule(cartItems: any[] = []) {
  const riceQuantity = getCartRiceQuantity(cartItems);
  const allowed = riceQuantity <= 1;

  return {
    allowed,
    riceQuantity,
    limit: 1,
    message: allowed ? "" : RICE_LIMIT_MESSAGE,
  };
}

export function validateLargeOilRule(cartItems: any[] = []) {
  const oilQuantity = getCartLargeOilQuantity(cartItems);
  const allowed = oilQuantity <= 1;

  return {
    allowed,
    oilQuantity,
    limit: 1,
    message: allowed ? "" : LARGE_OIL_LIMIT_MESSAGE,
  };
}

export function getCartRestrictionForProduct(product: any, variant: any, cartItems: any[] = [], quantity = 1) {
  const effectiveQuantity = Number(quantity ?? 1);
  const nextProduct = product ?? variant ?? null;

  if (isRiceProductByClassification(nextProduct)) {
    const nextRice = getCartRiceQuantity(cartItems) + effectiveQuantity;
    return nextRice > 1 ? RICE_LIMIT_MESSAGE : null;
  }

  if (isLargeOilVariantByClassification(product, variant ?? null)) {
    const nextOil = getCartLargeOilQuantity(cartItems) + effectiveQuantity;
    return nextOil > 1 ? LARGE_OIL_LIMIT_MESSAGE : null;
  }

  return null;
}

export function getCartRestrictionMessage({
  product,
  variant,
  cartItems = [],
  quantity = 1,
}: {
  product?: any;
  variant?: any;
  cartItems?: any[];
  quantity?: number;
} = {}) {
  return getCartRestrictionForProduct(product ?? variant ?? null, variant ?? null, cartItems, quantity);
}

export function canAddRiceProduct(cartItems: any[] = [], nextProduct: any, nextQuantity = 1) {
  if (!isRiceProductByClassification(nextProduct)) return { allowed: true, riceQuantity: getCartRiceQuantity(cartItems) };

  const existingRice = getCartRiceQuantity(cartItems);
  const nextRice = existingRice + Number(nextQuantity ?? 1);
  return {
    allowed: nextRice <= 1,
    riceQuantity: nextRice,
    message: nextRice <= 1 ? "" : RICE_LIMIT_MESSAGE,
  };
}

export function canAddLargeOilProduct(cartItems: any[] = [], nextProduct: any, nextVariant: any, nextQuantity = 1) {
  if (!isLargeOilVariantByClassification(nextProduct, nextVariant)) return { allowed: true, oilQuantity: getCartLargeOilQuantity(cartItems) };

  const existingOil = getCartLargeOilQuantity(cartItems);
  const nextOil = existingOil + Number(nextQuantity ?? 1);
  return {
    allowed: nextOil <= 1,
    oilQuantity: nextOil,
    message: nextOil <= 1 ? "" : LARGE_OIL_LIMIT_MESSAGE,
  };
}

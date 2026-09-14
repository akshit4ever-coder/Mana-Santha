export function normalizeProductStatus(status?: string | null): string {
  return String(status ?? "").trim().toLowerCase();
}

export function isParentProductAvailable(product?: any): boolean {
  if (!product) return false;
  return normalizeProductStatus(product.status) === "active" && product.is_active !== false;
}

export function isVariantAvailable(product?: any, variant?: any): boolean {
  if (!product || !variant) return false;
  if (!isParentProductAvailable(product)) return false;
  if (variant.is_active === false) return false;

  const stock = Number(variant.stock ?? 0);
  if (stock <= 0) return false;

  if (typeof variant.status === "undefined" || variant.status === null || String(variant.status ?? "").trim() === "") {
    return true;
  }

  return normalizeProductStatus(variant.status) === "active";
}

export function isProductAvailable(product?: any): boolean {
  if (!product) return false;

  if (Array.isArray(product.product_variants) && product.product_variants.length > 0) {
    return product.product_variants.some((variant: any) => isVariantAvailable(product, variant));
  }

  return isParentProductAvailable(product) && Number(product.stock ?? 0) > 0;
}

export function getProductAvailabilityState(productOrVariant?: any) {
  if (!productOrVariant) {
    return { stock: 0, status: "out_of_stock", isStatusActive: false, isAvailable: false };
  }

  const stock = Number(productOrVariant.stock ?? 0);
  const normalizedStatus = normalizeProductStatus(productOrVariant.status);
  const isStatusActive = normalizedStatus === "active" && productOrVariant.is_active !== false;
  const isAvailable = stock > 0 && isStatusActive;

  return {
    stock,
    status: isStatusActive ? "active" : "out_of_stock",
    isStatusActive,
    isAvailable,
  };
}

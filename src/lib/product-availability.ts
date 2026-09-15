export function normalizeProductStatus(status?: string | null): string {
  return String(status ?? "").trim().toLowerCase();
}

export function isParentProductAvailable(product?: any): boolean {
  if (!product) return false;

  const normalizedStatus = normalizeProductStatus(product.status);
  const parentStatusIsActive = normalizedStatus === "" || normalizedStatus === "active";
  const parentIsActiveFlag = product.is_active ?? true;

  if (!parentStatusIsActive || parentIsActiveFlag === false) {
    return false;
  }

  const hasVariants = Array.isArray(product.product_variants) && product.product_variants.length > 0;
  if (hasVariants) {
    return true;
  }

  return Number(product.stock ?? 0) > 0;
}

export function isVariantAvailable(product?: any, variant?: any): boolean {
  if (!product) return false;

  if (!variant) {
    return isParentProductAvailable(product);
  }

  if (!isParentProductAvailable(product)) return false;
  if ((variant.is_active ?? true) === false) return false;

  const stock = Number(variant.stock ?? 0);
  if (stock <= 0) return false;

  const normalizedStatus = normalizeProductStatus(variant.status);
  if (normalizedStatus === "" || normalizedStatus === "active") {
    return true;
  }

  return false;
}

export function isProductAvailable(product?: any): boolean {
  if (!product) return false;

  if (Array.isArray(product.product_variants) && product.product_variants.length > 0) {
    return product.product_variants.some((variant: any) => isVariantAvailable(product, variant));
  }

  return isParentProductAvailable(product);
}

export function getCartItemAvailabilityState(item?: any) {
  if (!item) {
    return { isAvailable: false, hasVariantFetchError: false, isMissingVariant: false };
  }

  const product = item.products ?? null;
  const variant = item.variant ?? null;

  if (item.variant_id) {
    if (item.variant_fetch_error === true) {
      return { isAvailable: false, hasVariantFetchError: true, isMissingVariant: false };
    }

    if (!product) {
      return { isAvailable: false, hasVariantFetchError: false, isMissingVariant: false };
    }

    if (!variant || item.variant_missing === true) {
      return { isAvailable: false, hasVariantFetchError: false, isMissingVariant: true };
    }

    const variantStock = Number(variant.stock ?? item.variant_stock ?? 0);
    return {
      isAvailable: isVariantAvailable(product, variant) && Number(item.quantity ?? 0) <= variantStock,
      hasVariantFetchError: false,
      isMissingVariant: false,
    };
  }

  if (!product) {
    return { isAvailable: false, hasVariantFetchError: false, isMissingVariant: false };
  }

  const stockLimit = Number(product.stock ?? 0);
  return {
    isAvailable: isProductAvailable(product) && Number(item.quantity ?? 0) <= stockLimit,
    hasVariantFetchError: false,
    isMissingVariant: false,
  };
}

export function getCartItemValidationDetail(item?: any) {
  const base = {
    cartItemId: item?.id ?? null,
    productId: item?.product_id ?? item?.products?.id ?? null,
    variantId: item?.variant_id ?? null,
    productName: item?.products?.name ?? item?.name ?? null,
    variantName: item?.variant_name ?? item?.variant?.name ?? null,
    size: item?.variant_name ?? item?.variant?.name ?? item?.variant_unit ?? item?.products?.unit ?? null,
    quantity: Number(item?.quantity ?? 0),
    productStock: Number(item?.products?.stock ?? item?.stock ?? 0),
    productStatus: item?.products?.status ?? item?.status ?? null,
    variantStock: Number(item?.variant?.stock ?? item?.variant_stock ?? 0),
    variantIsActive: item?.variant?.is_active ?? item?.is_active ?? true,
    isAvailable: false,
    availabilityReason: "unknown",
  };

  if (!item) {
    return { ...base, availabilityReason: "missing_item", isAvailable: false };
  }

  const product = item.products ?? null;
  const variant = item.variant ?? null;

  if (item.variant_id) {
    if (item.variant_fetch_error === true) {
      return { ...base, isAvailable: false, availabilityReason: "variant_fetch_error" };
    }

    if (!product) {
      return { ...base, isAvailable: false, availabilityReason: "product_missing" };
    }

    if (!variant || item.variant_missing === true) {
      return { ...base, isAvailable: false, availabilityReason: "variant_missing" };
    }

    if (normalizeProductStatus(product.status) !== "active" || product.is_active === false) {
      return { ...base, isAvailable: false, availabilityReason: "product_inactive" };
    }

    if ((variant.is_active ?? true) === false) {
      return { ...base, isAvailable: false, availabilityReason: "variant_inactive" };
    }

    if (Number(variant.stock ?? 0) <= 0) {
      return { ...base, isAvailable: false, availabilityReason: "variant_out_of_stock" };
    }

    if (Number(item.quantity ?? 0) > Number(variant.stock ?? 0)) {
      return { ...base, isAvailable: false, availabilityReason: "quantity_exceeds_stock" };
    }

    return { ...base, isAvailable: true, availabilityReason: "ok" };
  }

  if (!product) {
    return { ...base, isAvailable: false, availabilityReason: "product_missing" };
  }

  if (normalizeProductStatus(product.status) !== "active" || product.is_active === false) {
    return { ...base, isAvailable: false, availabilityReason: "product_inactive" };
  }

  if (Number(product.stock ?? 0) <= 0) {
    return { ...base, isAvailable: false, availabilityReason: "product_out_of_stock" };
  }

  if (Number(item.quantity ?? 0) > Number(product.stock ?? 0)) {
    return { ...base, isAvailable: false, availabilityReason: "quantity_exceeds_stock" };
  }

  return { ...base, isAvailable: true, availabilityReason: "ok" };
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

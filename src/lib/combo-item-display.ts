export function normalizeComboItemUnitForDisplay(unit: string | null | undefined) {
  const normalized = String(unit ?? "")
    .trim()
    .replace(/\s+/g, " ");

  if (!normalized) return "";

  const compact = normalized.replace(/^(\d+)\s*(kg|g|l|ml|lb|oz|cm|mm|m)$/i, "$1$2");
  return compact.trim();
}

export function formatComboItemQuantity(quantity: number, unit: string | null | undefined) {
  const normalizedUnit = normalizeComboItemUnitForDisplay(unit);

  if (!normalizedUnit) {
    return "";
  }

  if (quantity <= 1) {
    return normalizedUnit;
  }

  return `${quantity} × ${normalizedUnit}`;
}

export function getComboItemDisplayMeta(item: any) {
  const productName = item?.product?.name || item?.variant?.name || item?.name || item?.product_name || "వస్తువు";
  const quantity = Number(item?.quantity ?? 1);
  const unit = item?.unit_label || item?.variant?.unit || item?.product?.unit || item?.variant?.name || "";
  return {
    productName,
    quantity,
    unit,
    quantityLabel: formatComboItemQuantity(quantity, unit),
  };
}

export function formatINR(n: number | string): string {
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return "₹0";
  return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function discountPct(mrp: number | string, price: number | string): number {
  const m = Number(mrp);
  const p = Number(price);
  if (!m || m <= p) return 0;
  return Math.round(((m - p) / m) * 100);
}

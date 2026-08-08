//#region node_modules/.nitro/vite/services/ssr/assets/format-S14ZKO36.js
function formatINR(n) {
	const num = typeof n === "string" ? Number(n) : n;
	if (Number.isNaN(num)) return "₹0";
	return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function discountPct(mrp, price) {
	const m = Number(mrp);
	const p = Number(price);
	if (!m || m <= p) return 0;
	return Math.round((m - p) / m * 100);
}
//#endregion
export { formatINR as n, discountPct as t };

//#region node_modules/.nitro/vite/services/ssr/assets/variant-utils-CdWziRXU.js
function resolveCartItemPrice(product, variant) {
	if (variant && variant.is_active !== false) {
		const price = Number(variant.price ?? product?.price ?? 0);
		if (Number.isFinite(price)) return price;
	}
	return Number(product?.price ?? 0);
}
function resolveCartItemName(product, variant) {
	if (variant?.name) return `${product?.name ?? ""} — ${variant.name}`.trim();
	return product?.name ?? "";
}
function resolveCartItemDisplayMeta(product, variant) {
	return {
		name: resolveCartItemName(product, variant),
		image_url: variant?.image_url || product?.image_url || null,
		unit: variant?.unit || product?.unit || null,
		price: resolveCartItemPrice(product, variant),
		mrp: Number(variant?.mrp ?? product?.mrp ?? 0),
		variant_name: variant?.name ?? null,
		variant_id: variant?.id ?? null
	};
}
//#endregion
export { resolveCartItemDisplayMeta as t };

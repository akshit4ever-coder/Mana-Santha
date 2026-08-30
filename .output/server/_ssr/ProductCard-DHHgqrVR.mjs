import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { n as useAuth } from "./auth-BQz0ixQ6.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as LoaderCircle, S as Plus, T as Minus } from "../_libs/lucide-react.mjs";
import { n as useAddToCart, r as useCart, u as useUpdateCartQty } from "./Header-D1MszUzt.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
import { n as PLACEHOLDER_IMAGE } from "./product-storage-C7t5u44h.mjs";
import { n as formatINR, t as discountPct } from "./format-S14ZKO36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-DHHgqrVR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const { user } = useAuth();
	const { data: cart } = useCart(user?.id);
	const add = useAddToCart(user?.id);
	const update = useUpdateCartQty(user?.id);
	const firstVariant = product.product_variants?.find((v) => v.is_active !== false) ?? null;
	const [selectedVariant, setSelectedVariant] = (0, import_react.useState)(firstVariant ?? null);
	const rawItem = cart?.find((c) => c.product_id === product.id);
	const item = rawItem && (selectedVariant ? rawItem.variant_id === selectedVariant.id : rawItem.variant_id == null) ? rawItem : null;
	const displayPrice = selectedVariant ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price) : Number(product.price);
	const displayMrp = selectedVariant ? Number(selectedVariant.mrp ?? product.mrp) : Number(product.mrp);
	const pct = discountPct(displayMrp, displayPrice);
	const outOfStock = selectedVariant ? (selectedVariant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$slug",
			params: { slug: product.slug },
			className: "relative aspect-square overflow-hidden bg-secondary/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: selectedVariant?.image_url || firstVariant?.image_url || product.image_url || "/assets/images/product-placeholder.png",
					alt: product.name,
					loading: "lazy",
					decoding: "async",
					className: "h-full w-full object-cover transition-transform group-hover:scale-105",
					onError: (e) => {
						e.currentTarget.src = PLACEHOLDER_IMAGE;
					}
				}),
				pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "absolute left-2 top-2 bg-accent text-accent-foreground shadow",
					children: [pct, "% OFF"]
				}),
				outOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold",
					children: "Out of stock"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1 p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
					children: product.brand
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					className: "line-clamp-2 text-sm font-medium leading-snug hover:text-primary",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: product.weight ?? product.unit
				}),
				product.product_variants && product.product_variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex gap-2",
					children: product.product_variants.filter((v) => v.is_active !== false).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedVariant(v),
						className: `rounded-lg px-2 py-1 text-xs border ${selectedVariant?.id === v.id ? "bg-primary/10 text-primary font-semibold" : "bg-card hover:bg-secondary"}`,
						children: v.name
					}, v.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-base font-bold",
						children: formatINR(displayPrice)
					}), pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground line-through",
						children: formatINR(displayMrp)
					})] }), item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-full bg-primary text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
								onClick: () => update.mutate({
									id: item.id,
									quantity: item.quantity - 1
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-6 text-center text-sm font-bold",
								children: item.quantity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								variant: "ghost",
								className: "h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
								disabled: item.quantity >= (item["variant_max_qty"] ?? selectedVariant?.max_qty ?? firstVariant?.max_qty ?? product.max_qty) || item.quantity >= (selectedVariant?.stock ?? firstVariant?.stock ?? product.stock),
								onClick: () => update.mutate({
									id: item.id,
									quantity: item.quantity + 1
								}),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: outOfStock || add.isPending,
						onClick: () => add.mutate({
							productId: product.id,
							variant: selectedVariant ? {
								id: selectedVariant.id,
								name: selectedVariant.name,
								price: selectedVariant.selling_price ?? selectedVariant.price,
								mrp: selectedVariant.mrp,
								image_url: selectedVariant.image_url ?? product.image_url,
								unit: selectedVariant.unit ?? product.unit
							} : void 0
						}),
						className: "h-9 rounded-full border-primary/30 font-semibold text-primary hover:bg-primary hover:text-primary-foreground",
						children: add.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "ADD"
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };

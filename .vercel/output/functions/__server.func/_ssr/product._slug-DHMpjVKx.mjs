import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { A as LoaderCircle, F as Heart, S as Plus, T as Minus, a as Truck, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as useAuth, n as Route, o as Button } from "./router-FeVGlH3n.mjs";
import { d as useWishlist, l as useToggleWishlist, n as useAddToCart, o as useProduct, r as useCart, s as useProducts, t as Header, u as useUpdateCartQty } from "./Header-DXMouS3f.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
import { n as PLACEHOLDER_IMAGE } from "./product-storage-CLqEGs3S.mjs";
import { n as formatINR, t as discountPct } from "./format-S14ZKO36.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as ProductCard } from "./ProductCard-B8vKsZx0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-DHMpjVKx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { slug } = Route.useParams();
	const { data: product, isLoading } = useProduct(slug);
	const { user } = useAuth();
	const { data: cart } = useCart(user?.id);
	const { data: wl } = useWishlist(user?.id);
	const add = useAddToCart(user?.id);
	const upd = useUpdateCartQty(user?.id);
	const wish = useToggleWishlist(user?.id);
	const { data: related } = useProducts({
		categorySlug: product?.categories?.slug,
		limit: 10
	});
	const variants = product?.product_variants ?? [];
	const firstVariant = variants.find((v) => v.is_active !== false) ?? null;
	const [selectedVariantId, setSelectedVariantId] = (0, import_react.useState)(firstVariant?.id ?? null);
	(0, import_react.useEffect)(() => {
		if (!product) return;
		if (!(selectedVariantId ? variants.some((v) => v.id === selectedVariantId) : false) && firstVariant) setSelectedVariantId(firstVariant.id);
	}, [
		product,
		variants,
		firstVariant,
		selectedVariantId
	]);
	const selectedVariant = (0, import_react.useMemo)(() => {
		if (!product) return null;
		return variants.find((v) => v.id === selectedVariantId) ?? firstVariant ?? null;
	}, [
		product,
		variants,
		selectedVariantId,
		firstVariant
	]);
	const displayPrice = (0, import_react.useMemo)(() => {
		if (!product) return 0;
		return selectedVariant ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price) : Number(product.price);
	}, [selectedVariant, product]);
	const displayMrp = (0, import_react.useMemo)(() => {
		if (!product) return 0;
		return selectedVariant ? Number(selectedVariant.mrp ?? product.mrp) : Number(product.mrp);
	}, [selectedVariant, product]);
	const pct = (0, import_react.useMemo)(() => discountPct(displayMrp, displayPrice), [displayMrp, displayPrice]);
	const item = cart?.find((c) => c.product_id === product?.id && (selectedVariant ? c.variant_id === selectedVariant.id : c.variant_id == null));
	const isWish = wl?.some((w) => w.product_id === product?.id);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		})]
	});
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "py-20 text-center",
			children: "Product not found"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "mb-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-primary",
							children: "Home"
						}), product.categories && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" / ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/category/$slug",
							params: { slug: product.categories.slug },
							className: "hover:text-primary",
							children: product.categories.name
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden rounded-2xl border bg-card shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: selectedVariant?.image_url || product.image_url || "/assets/images/product-placeholder.png",
								alt: product.name,
								loading: "lazy",
								decoding: "async",
								className: "aspect-square w-full object-cover",
								onError: (e) => {
									e.currentTarget.src = PLACEHOLDER_IMAGE;
								}
							}), pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "absolute left-4 top-4 bg-accent text-accent-foreground",
								children: [pct, "% OFF"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: product.brand
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-3xl font-bold leading-tight",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-sm text-muted-foreground",
								children: selectedVariant?.unit ?? selectedVariant?.quantity_value ? `${selectedVariant.quantity_value ?? ""} ${selectedVariant.unit ?? ""}`.trim() : product.weight ?? product.unit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl font-extrabold text-primary",
									children: formatINR(displayPrice)
								}), pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-lg text-muted-foreground line-through",
									children: formatINR(displayMrp)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-semibold text-success",
									children: [
										"Save ",
										pct,
										"%"
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Inclusive of all taxes"
							}),
							product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 text-sm leading-relaxed text-muted-foreground",
								children: product.description
							}),
							product.product_variants && product.product_variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground mb-2",
									children: product.variant_option_name ?? "Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: product.product_variants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: `rounded-full px-3 py-1 text-sm border ${selectedVariantId === v.id ? "border-primary bg-primary/10" : ""}`,
										onClick: () => setSelectedVariantId(v.id),
										children: v.name
									}, v.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-full bg-primary p-1 text-primary-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
											onClick: () => upd.mutate({
												id: item.id,
												quantity: item.quantity - 1
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-10 text-center text-lg font-bold",
											children: item.quantity
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
											disabled: item.quantity >= (selectedVariant?.max_qty ?? product.max_qty) || item.quantity >= (selectedVariant ? selectedVariant.stock : product.stock),
											onClick: () => upd.mutate({
												id: item.id,
												quantity: item.quantity + 1
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "lg",
									disabled: (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0) || (selectedVariant ? selectedVariant.max_qty <= 0 : product.max_qty <= 0),
									onClick: () => add.mutate({
										productId: product.id,
										variant: selectedVariant ? {
											id: selectedVariant.id,
											name: selectedVariant.name,
											price: selectedVariant.selling_price ?? selectedVariant.price,
											mrp: selectedVariant.mrp,
											image_url: selectedVariant.image_url ?? product.image_url,
											unit: selectedVariant.unit ?? product.unit,
											max_qty: selectedVariant.max_qty ?? product.max_qty
										} : void 0
									}),
									className: "rounded-full",
									children: (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0) ? "Out of stock" : "Add to Cart"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									variant: "outline",
									onClick: () => wish.mutate(product.id),
									className: "rounded-full",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `mr-2 h-4 w-4 ${isWish ? "fill-destructive text-destructive" : ""}` }),
										" ",
										isWish ? "Saved" : "Wishlist"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "Fast delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Same-day slots"
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold",
										children: "100% quality"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: "Fresh guarantee"
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 rounded-lg border bg-card p-4 text-sm shadow-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "SKU"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: selectedVariant?.sku ?? product.sku ?? "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Unit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: selectedVariant?.unit ?? product.unit
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Weight"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: selectedVariant?.quantity_value ? `${selectedVariant.quantity_value} ${selectedVariant.unit ?? ""}`.trim() : product.weight ?? "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "In stock"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-medium",
											children: [selectedVariant ? selectedVariant.stock : product.stock, " available"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Max per order"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: selectedVariant ? selectedVariant.max_qty : product.max_qty
										})
									]
								})
							})
						] })]
					}),
					related && related.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 text-xl font-bold",
							children: "Similar products"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
							children: related.filter((r) => r.id !== product.id).slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ProductPage as component };

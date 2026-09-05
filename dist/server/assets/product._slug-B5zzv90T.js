import { a as useAuth, n as Route, o as Button } from "./router-DKDYeeFZ.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { r as PLACEHOLDER_IMAGE } from "./product-storage-CLqEGs3S.js";
import { n as formatINR, t as discountPct } from "./format-S14ZKO36.js";
import { d as useWishlist, l as useToggleWishlist, n as useAddToCart, o as useProduct, r as useCart, s as useProducts, t as Header, u as useUpdateCartQty } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { t as ProductCard } from "./ProductCard-DrlZuPNB.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Heart, Loader2, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
//#region src/routes/product.$slug.tsx?tsr-split=component
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
	const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id ?? null);
	useEffect(() => {
		if (!product) return;
		if (!(selectedVariantId ? variants.some((v) => v.id === selectedVariantId) : false) && firstVariant) setSelectedVariantId(firstVariant.id);
	}, [
		product,
		variants,
		firstVariant,
		selectedVariantId
	]);
	const selectedVariant = useMemo(() => {
		if (!product) return null;
		return variants.find((v) => v.id === selectedVariantId) ?? firstVariant ?? null;
	}, [
		product,
		variants,
		selectedVariantId,
		firstVariant
	]);
	const displayPrice = useMemo(() => {
		if (!product) return 0;
		return selectedVariant ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price) : Number(product.price);
	}, [selectedVariant, product]);
	const displayMrp = useMemo(() => {
		if (!product) return 0;
		return selectedVariant ? Number(selectedVariant.mrp ?? product.mrp) : Number(product.mrp);
	}, [selectedVariant, product]);
	const pct = useMemo(() => discountPct(displayMrp, displayPrice), [displayMrp, displayPrice]);
	const item = cart?.find((c) => c.product_id === product?.id && (selectedVariant ? c.variant_id === selectedVariant.id : c.variant_id == null));
	const isWish = wl?.some((w) => w.product_id === product?.id);
	if (isLoading) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("div", {
			className: "flex justify-center py-20",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
		})]
	});
	if (!product) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("div", {
			className: "py-20 text-center",
			children: "Product not found"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-6",
				children: [
					/* @__PURE__ */ jsxs("nav", {
						className: "mb-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "hover:text-primary",
							children: "Home"
						}), product.categories && /* @__PURE__ */ jsxs(Fragment, { children: [" / ", /* @__PURE__ */ jsx(Link, {
							to: "/category/$slug",
							params: { slug: product.categories.slug },
							className: "hover:text-primary",
							children: product.categories.name
						})] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-8 lg:grid-cols-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "relative overflow-hidden rounded-2xl border bg-card shadow-card",
							children: [/* @__PURE__ */ jsx("img", {
								src: selectedVariant?.image_url || product.image_url || "/assets/images/product-placeholder.png",
								alt: product.name,
								loading: "lazy",
								decoding: "async",
								className: "aspect-square w-full object-cover",
								onError: (e) => {
									e.currentTarget.src = PLACEHOLDER_IMAGE;
								}
							}), pct > 0 && /* @__PURE__ */ jsxs(Badge, {
								className: "absolute left-4 top-4 bg-accent text-accent-foreground",
								children: [pct, "% OFF"]
							})]
						}), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: product.brand
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "mt-1 text-3xl font-bold leading-tight",
								children: product.name
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-sm text-muted-foreground",
								children: selectedVariant?.unit ?? selectedVariant?.quantity_value ? `${selectedVariant.quantity_value ?? ""} ${selectedVariant.unit ?? ""}`.trim() : product.weight ?? product.unit
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex items-end gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-3xl font-extrabold text-primary",
									children: formatINR(displayPrice)
								}), pct > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
									className: "text-lg text-muted-foreground line-through",
									children: formatINR(displayMrp)
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-sm font-semibold text-success",
									children: [
										"Save ",
										pct,
										"%"
									]
								})] })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Inclusive of all taxes"
							}),
							product.description && /* @__PURE__ */ jsx("p", {
								className: "mt-6 text-sm leading-relaxed text-muted-foreground",
								children: product.description
							}),
							product.product_variants && product.product_variants.length > 0 && /* @__PURE__ */ jsxs("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm text-muted-foreground mb-2",
									children: product.variant_option_name ?? "Size"
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-2",
									children: product.product_variants.map((v) => /* @__PURE__ */ jsx("button", {
										className: `rounded-full px-3 py-1 text-sm border ${selectedVariantId === v.id ? "border-primary bg-primary/10" : ""}`,
										onClick: () => setSelectedVariantId(v.id),
										children: v.name
									}, v.id))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: [item ? /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 rounded-full bg-primary p-1 text-primary-foreground",
									children: [
										/* @__PURE__ */ jsx(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
											onClick: () => upd.mutate({
												id: item.id,
												quantity: item.quantity - 1
											}),
											children: /* @__PURE__ */ jsx(Minus, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ jsx("span", {
											className: "min-w-10 text-center text-lg font-bold",
											children: item.quantity
										}),
										/* @__PURE__ */ jsx(Button, {
											size: "icon",
											variant: "ghost",
											className: "h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground",
											disabled: item.quantity >= (selectedVariant?.max_qty ?? product.max_qty) || item.quantity >= (selectedVariant ? selectedVariant.stock : product.stock),
											onClick: () => upd.mutate({
												id: item.id,
												quantity: item.quantity + 1
											}),
											children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
										})
									]
								}) : /* @__PURE__ */ jsx(Button, {
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
								}), /* @__PURE__ */ jsxs(Button, {
									size: "lg",
									variant: "outline",
									onClick: () => wish.mutate(product.id),
									className: "rounded-full",
									children: [
										/* @__PURE__ */ jsx(Heart, { className: `mr-2 h-4 w-4 ${isWish ? "fill-destructive text-destructive" : ""}` }),
										" ",
										isWish ? "Saved" : "Wishlist"
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-8 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card",
									children: [/* @__PURE__ */ jsx(Truck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-semibold",
										children: "Fast delivery"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: "Same-day slots"
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card",
									children: [/* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-semibold",
										children: "100% quality"
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: "Fresh guarantee"
									})] })]
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-6 rounded-lg border bg-card p-4 text-sm shadow-card",
								children: /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 gap-2",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "SKU"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-medium",
											children: selectedVariant?.sku ?? product.sku ?? "-"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Unit"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-medium",
											children: selectedVariant?.unit ?? product.unit
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Weight"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-medium",
											children: selectedVariant?.quantity_value ? `${selectedVariant.quantity_value} ${selectedVariant.unit ?? ""}`.trim() : product.weight ?? "-"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "In stock"
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "font-medium",
											children: [selectedVariant ? selectedVariant.stock : product.stock, " available"]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: "Max per order"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "font-medium",
											children: selectedVariant ? selectedVariant.max_qty : product.max_qty
										})
									]
								})
							})
						] })]
					}),
					related && related.length > 1 && /* @__PURE__ */ jsxs("section", {
						className: "mt-14",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "mb-4 text-xl font-bold",
							children: "Similar products"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
							children: related.filter((r) => r.id !== product.id).slice(0, 5).map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ProductPage as component };

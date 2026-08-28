import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { n as useAuth } from "./auth-uHCqpL7U.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Plus, T as Minus, c as Trash2, g as ShoppingBag } from "../_libs/lucide-react.mjs";
import { c as useRemoveCartItem, r as useCart, t as Header, u as useUpdateCartQty } from "./Header-CfTf-_A6.mjs";
import { n as PLACEHOLDER_IMAGE } from "./product-storage-C7t5u44h.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-AVMe199a.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const { user } = useAuth();
	const { data: cart } = useCart(user?.id);
	const upd = useUpdateCartQty(user?.id);
	const del = useRemoveCartItem(user?.id);
	const items = cart ?? [];
	const subtotal = items.reduce((s, i) => s + Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity, 0);
	const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 29;
	const total = subtotal + deliveryFee;
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container mx-auto px-4 py-20 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Please sign in to view your cart"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6 rounded-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Sign in"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "Your Cart"
				}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-16 text-center shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-semibold",
							children: "Your cart is empty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Add fresh groceries to get started."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-6 rounded-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Continue shopping"
							})
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[1fr_360px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 rounded-xl border bg-card p-3 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: i.variant_image_url || i.products?.image_url || "/assets/images/product-placeholder.png",
									alt: i.products?.name,
									loading: "lazy",
									decoding: "async",
									className: "h-24 w-24 rounded-lg object-cover",
									onError: (e) => {
										e.currentTarget.src = PLACEHOLDER_IMAGE;
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 flex-col",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-medium uppercase text-muted-foreground",
											children: i.products?.brand
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/product/$slug",
											params: { slug: i.products?.slug ?? "" },
											className: "font-semibold leading-tight hover:text-primary",
											children: i.products?.name
										}),
										i.variant_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm text-muted-foreground",
											children: i.variant_name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: i.variant_unit ?? i.products?.weight ?? i.products?.unit
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto flex items-end justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-lg font-bold",
												children: formatINR(Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1 rounded-full border bg-secondary p-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8 rounded-full",
														onClick: () => upd.mutate({
															id: i.id,
															quantity: i.quantity - 1
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-6 text-center text-sm font-bold",
														children: i.quantity
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8 rounded-full",
														disabled: i.quantity >= (i.variant_max_qty ?? i.products?.max_qty ?? 20),
														onClick: () => upd.mutate({
															id: i.id,
															quantity: i.quantity + 1
														}),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									className: "h-8 w-8 text-muted-foreground hover:text-destructive",
									onClick: () => del.mutate(i.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							]
						}, i.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:sticky lg:top-24 lg:self-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-5 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mb-4 text-lg font-bold",
									children: "Order Summary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Subtotal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: formatINR(subtotal)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Delivery fee"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: deliveryFee === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-success",
													children: "FREE"
												}) : formatINR(deliveryFee)
											})]
										}),
										subtotal < 499 && subtotal > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-md bg-accent/10 p-2 text-xs text-accent-foreground/80",
											children: [
												"Add ",
												formatINR(499 - subtotal),
												" more for free delivery"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-lg font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatINR(total) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									className: "mt-4 w-full rounded-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/checkout",
										children: "Proceed to Checkout"
									})
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CartPage as component };

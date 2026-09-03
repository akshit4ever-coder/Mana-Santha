import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Clock, a as Truck, f as Tag, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { i as useCategories, s as useProducts, t as Header } from "./Header-CqAWbfhW.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as ProductCard } from "./ProductCard-i9r4K_3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CjK7KAmV.js
var import_jsx_runtime = require_jsx_runtime();
var hero_groceries_default = "/assets/hero-groceries-m_gCqZg2.jpg";
function Home() {
	const { data: cats } = useCategories();
	const { data: featured } = useProducts({
		featured: true,
		limit: 10
	});
	const { data: all } = useProducts({ limit: 20 });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "relative overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[420px] md:h-[560px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: hero_groceries_default,
								alt: "Fresh groceries in a basket",
								className: "absolute inset-0 h-full w-full object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "container relative z-10 mx-auto flex h-full items-center px-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-xl text-primary-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 inline-flex items-center gap-2 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-accent-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-3.5 w-3.5" }), "First order free delivery"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl lg:text-6xl",
											children: "Fresh Groceries, Delivered Fast"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm md:text-lg opacity-90",
											children: "From farm-fresh produce to your favourite kirana brands — everything you need, delivered to your doorstep."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-6 flex flex-wrap gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "lg",
												className: "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/shop-fresh",
													children: "Shop Fresh"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												asChild: true,
												size: "lg",
												variant: "outline",
												className: "rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/kirana-essentials",
													children: "Kirana essentials"
												})
											})]
										})
									]
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "border-b bg-secondary/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "container mx-auto grid grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4",
						children: [
							{
								icon: Truck,
								t: "Fast Delivery",
								d: "Same-day slots"
							},
							{
								icon: ShieldCheck,
								t: "100% Fresh",
								d: "Farm-picked daily"
							},
							{
								icon: Clock,
								t: "24/7 Support",
								d: "We're here to help"
							},
							{
								icon: Tag,
								t: "Best Prices",
								d: "Everyday low costs"
							}
						].map(({ icon: Icon, t, d }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: d
							})] })]
						}, t))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 py-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 flex items-end justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold md:text-3xl",
							children: "Shop by Category"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
						children: cats?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: `/category/${c.slug}`,
							className: "group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-28 w-28 items-center justify-center overflow-hidden bg-gradient-fresh text-3xl",
								children: c.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.image_url,
									alt: c.name,
									className: "h-full w-full object-cover rounded-none"
								}) : c.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-medium leading-tight",
								children: c.name
							})]
						}, c.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 flex items-end justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-bold md:text-3xl",
							children: "Best Sellers"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Handpicked favourites, delivered fast"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						children: featured?.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "container mx-auto px-4 py-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-2xl font-bold md:text-3xl",
						children: "Fresh Arrivals"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
						children: all?.slice(0, 10).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Home as component };

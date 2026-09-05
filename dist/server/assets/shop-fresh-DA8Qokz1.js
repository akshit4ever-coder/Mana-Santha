import { i as useCategories, t as Header } from "./Header-HVVZP3-J.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/shop-fresh.tsx?tsr-split=component
function ShopFreshPage() {
	const { data: cats } = useCategories();
	const freshCats = (cats || []).filter((c) => {
		const n = (c.name || "").toLowerCase();
		const s = (c.slug || "").toLowerCase();
		return /fruit|veget|milk|dairy|egg|meat/.test(n) || /fruit|veget|milk|dairy|egg|meat/.test(s);
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex items-end justify-between",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold md:text-3xl",
						children: "Shop Fresh"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Fruits, vegetables, milk & products, eggs & meat"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
					children: freshCats.map((c) => /* @__PURE__ */ jsxs(Link, {
						to: `/category/${c.slug}`,
						className: "group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow",
						children: [/* @__PURE__ */ jsx("div", {
							className: "flex h-28 w-28 items-center justify-center overflow-hidden bg-gradient-fresh text-3xl",
							children: c.image_url ? /* @__PURE__ */ jsx("img", {
								src: c.image_url,
								alt: c.name,
								className: "h-full w-full object-cover rounded-none"
							}) : c.icon
						}), /* @__PURE__ */ jsx("div", {
							className: "text-xs font-medium leading-tight",
							children: c.name
						})]
					}, c.id))
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { ShopFreshPage as component };

import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as useCategories, s as useProducts, t as Header } from "./Header-CA9hksBN.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as Route } from "./category._slug-DIhDuVv7.mjs";
import { t as ProductCard } from "./ProductCard-CIUOtJvo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-9ZYEVQpo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const { slug } = Route.useParams();
	const { data: cats } = useCategories();
	const { data: products } = useProducts({ categorySlug: slug });
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const category = cats?.find((c) => c.slug === slug);
	const { data: subcategories } = useQuery({
		queryKey: ["subcategories", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", category?.id ?? "").eq("is_active", true).order("name");
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!category?.id
	});
	const sorted = [...products ?? []].sort((a, b) => {
		if (sort === "price-asc") return Number(a.price) - Number(b.price);
		if (sort === "price-desc") return Number(b.price) - Number(a.price);
		if (sort === "discount") {
			const da = (Number(a.mrp) - Number(a.price)) / Number(a.mrp);
			return (Number(b.mrp) - Number(b.price)) / Number(b.mrp) - da;
		}
		return 0;
	});
	const uncategorizedItems = sorted.filter((p) => !p.subcategory_id);
	const categorySections = subcategories?.map((sub) => ({
		sub,
		items: sorted.filter((p) => p.subcategory_id === sub.id)
	})) ?? [];
	const hasAnySectionItems = categorySections.some((section) => section.items.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-24 rounded-xl border bg-card p-4 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Categories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-1",
							children: cats?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/category/$slug",
								params: { slug: c.slug },
								className: `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${c.slug === slug ? "bg-primary/10 font-semibold text-primary" : "hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg",
									children: c.icon
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
							}, c.id))
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold md:text-3xl",
						children: category?.name ?? "Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [sorted.length, " products"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onValueChange: setSort,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-44",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sort by" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "relevance",
								children: "Relevance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "price-asc",
								children: "Price: Low to High"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "price-desc",
								children: "Price: High to Low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "discount",
								children: "Highest Discount"
							})
						] })]
					})]
				}), subcategories && subcategories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-8",
					children: [
						categorySections.map(({ sub, items }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 text-xl font-semibold",
							children: sub.name
						}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border bg-card p-6 text-sm text-muted-foreground",
							children: "No products in this subcategory yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
							children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
						})] }, sub.id)),
						uncategorizedItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 text-xl font-semibold",
							children: ["More ", category?.name ?? "Products"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
							children: uncategorizedItems.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
						})] }),
						!hasAnySectionItems && uncategorizedItems.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border bg-card p-10 text-center text-muted-foreground",
							children: "No products in this category yet."
						})
					]
				}) : sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border bg-card p-10 text-center text-muted-foreground",
					children: "No products in this category yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
					children: sorted.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };

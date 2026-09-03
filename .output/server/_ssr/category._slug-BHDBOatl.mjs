import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { i as useCategories, s as useProducts, t as Header } from "./Header-CqAWbfhW.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.mjs";
import { t as Footer } from "./Footer-CfwbBDT3.mjs";
import { t as Route } from "./category._slug-CUi-GzVJ.mjs";
import { t as ProductCard } from "./ProductCard-i9r4K_3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-BHDBOatl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CategoryRail({ categories, subcategories, currentSlug, selectedSubcategoryId, onSelectSubcategory }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden lg:flex lg:flex-col lg:items-center lg:w-20 lg:pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sticky top-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelectSubcategory?.(null),
				className: `flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === null ? "ring-2 ring-primary" : "hover:bg-secondary"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 flex items-center justify-center rounded-md bg-card p-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "h-6 w-6 text-primary",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: "M3 12h18",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-center",
					children: "All"
				})]
			}), subcategories?.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onSelectSubcategory?.(s.id),
				className: `flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === s.id ? "ring-2 ring-primary" : "hover:bg-secondary"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 flex items-center justify-center overflow-hidden rounded-md bg-card",
					children: s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.image_url,
						alt: s.name,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 bg-muted" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-center line-clamp-1 w-16",
					children: s.name
				})]
			}, s.id))]
		})
	});
}
function CategoryPage() {
	const { slug } = Route.useParams();
	const { data: cats } = useCategories();
	const { data: products } = useProducts({ categorySlug: slug });
	const [sort, setSort] = (0, import_react.useState)("relevance");
	const [selectedSubcategoryId, setSelectedSubcategoryId] = (0, import_react.useState)(null);
	const [expandedSubcategories, setExpandedSubcategories] = (0, import_react.useState)({});
	const category = cats?.find((c) => c.slug === slug);
	const [fetchedSubcategories, setFetchedSubcategories] = (0, import_react.useState)(null);
	const subcategories = fetchedSubcategories ?? category?.subcategories ?? [];
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const load = async () => {
			if (!category?.id) return;
			const existing = category.subcategories ?? [];
			if (existing && existing.length > 0) return;
			try {
				const { data } = await supabase.from("subcategories").select("*").eq("category_id", category.id).eq("is_active", true).order("name");
				if (!mounted) return;
				setFetchedSubcategories(data ?? []);
			} catch (e) {
				console.warn("Failed to load subcategories for category", category.id, e);
			}
		};
		load();
		return () => {
			mounted = false;
		};
	}, [category?.id]);
	const sorted = [...products ?? []].sort((a, b) => {
		const aPrice = Number(a.selling_price ?? a.price ?? 0);
		const bPrice = Number(b.selling_price ?? b.price ?? 0);
		if (sort === "price-asc") return aPrice - bPrice;
		if (sort === "price-desc") return bPrice - aPrice;
		if (sort === "discount") {
			const aMrp = Number(a.mrp ?? 0);
			const bMrp = Number(b.mrp ?? 0);
			const da = (aMrp - aPrice) / (aMrp || 1);
			return (bMrp - bPrice) / (bMrp || 1) - da;
		}
		return 0;
	});
	const displayedProducts = selectedSubcategoryId ? sorted.filter((p) => p.subcategory_id === selectedSubcategoryId) : sorted;
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
							className: "flex gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRail, {
								categories: cats ?? [],
								subcategories,
								currentSlug: slug,
								selectedSubcategoryId,
								onSelectSubcategory: (id) => setSelectedSubcategoryId(id)
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold md:text-3xl",
							children: category?.name ?? "Products"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [displayedProducts.length, " products"]
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
					}),
					subcategories && subcategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "-mx-4 overflow-x-auto px-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSelectedSubcategoryId(null),
									className: `min-w-[90px] rounded-lg border px-3 py-2 ${selectedSubcategoryId === null ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`,
									children: "All"
								}), subcategories.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSelectedSubcategoryId(s.id),
									className: `min-w-[90px] flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 ${selectedSubcategoryId === s.id ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted",
										children: s.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: s.image_url,
											alt: s.name,
											className: "h-full w-full object-cover"
										}) : null
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm",
										children: s.name
									})]
								}, s.id))]
							})
						})
					}),
					subcategories && subcategories.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-8",
						children: (selectedSubcategoryId ? subcategories.filter((s) => s.id === selectedSubcategoryId) : subcategories).map((sub) => {
							const items = displayedProducts.filter((p) => p.subcategory_id === sub.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-3 text-xl font-semibold",
								children: sub.name
							}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border bg-card p-6 text-sm text-muted-foreground",
								children: "No products in this subcategory yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
								children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
							})] }, sub.id);
						})
					}) : sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border bg-card p-10 text-center text-muted-foreground",
						children: "No products in this category yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
						children: displayedProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };

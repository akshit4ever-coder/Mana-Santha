import { t as supabase } from "./client-Dxm-ZOZR.js";
import { r as Route } from "./router-CCehujYb.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { i as useCategories, s as useProducts, t as Header } from "./Header-HVVZP3-J.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { t as ProductCard } from "./ProductCard-B8QiOZmx.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Layout/CategoryRail.tsx
function CategoryRail({ categories, subcategories, currentSlug, selectedSubcategoryId, onSelectSubcategory }) {
	return /* @__PURE__ */ jsx("aside", {
		className: "hidden lg:flex lg:flex-col lg:items-center lg:w-20 lg:pt-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-3 sticky top-24",
			children: [/* @__PURE__ */ jsxs("button", {
				onClick: () => onSelectSubcategory?.(null),
				className: `flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === null ? "ring-2 ring-primary" : "hover:bg-secondary"}`,
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-10 w-10 flex items-center justify-center rounded-md bg-card p-1",
					children: /* @__PURE__ */ jsx("svg", {
						className: "h-6 w-6 text-primary",
						viewBox: "0 0 24 24",
						fill: "none",
						children: /* @__PURE__ */ jsx("path", {
							d: "M3 12h18",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-center",
					children: "All"
				})]
			}), subcategories?.map((s) => /* @__PURE__ */ jsxs("button", {
				onClick: () => onSelectSubcategory?.(s.id),
				className: `flex flex-col items-center gap-1 rounded-lg p-1 ${selectedSubcategoryId === s.id ? "ring-2 ring-primary" : "hover:bg-secondary"}`,
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-10 w-10 flex items-center justify-center overflow-hidden rounded-md bg-card",
					children: s.image_url ? /* @__PURE__ */ jsx("img", {
						src: s.image_url,
						alt: s.name,
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ jsx("div", { className: "h-6 w-6 bg-muted" })
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-center line-clamp-1 w-16",
					children: s.name
				})]
			}, s.id))]
		})
	});
}
//#endregion
//#region src/routes/category.$slug.tsx?tsr-split=component
function CategoryPage() {
	const { slug } = Route.useParams();
	const { data: cats } = useCategories();
	const { data: products } = useProducts({ categorySlug: slug });
	const [sort, setSort] = useState("relevance");
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
	const [expandedSubcategories, setExpandedSubcategories] = useState({});
	const category = cats?.find((c) => c.slug === slug);
	const [fetchedSubcategories, setFetchedSubcategories] = useState(null);
	const subcategories = fetchedSubcategories ?? category?.subcategories ?? [];
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ jsx("aside", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ jsxs("div", {
						className: "sticky top-24 rounded-xl border bg-card p-4 shadow-card",
						children: [/* @__PURE__ */ jsx("h3", {
							className: "mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground",
							children: "Categories"
						}), /* @__PURE__ */ jsx("div", {
							className: "flex gap-3",
							children: /* @__PURE__ */ jsx(CategoryRail, {
								categories: cats ?? [],
								subcategories,
								currentSlug: slug,
								selectedSubcategoryId,
								onSelectSubcategory: (id) => setSelectedSubcategoryId(id)
							})
						})]
					})
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-4 flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold md:text-3xl",
							children: category?.name ?? "Products"
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-sm text-muted-foreground",
							children: [displayedProducts.length, " products"]
						})] }), /* @__PURE__ */ jsxs(Select, {
							value: sort,
							onValueChange: setSort,
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "w-44",
								children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Sort by" })
							}), /* @__PURE__ */ jsxs(SelectContent, { children: [
								/* @__PURE__ */ jsx(SelectItem, {
									value: "relevance",
									children: "Relevance"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "price-asc",
									children: "Price: Low to High"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "price-desc",
									children: "Price: High to Low"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "discount",
									children: "Highest Discount"
								})
							] })]
						})]
					}),
					subcategories && subcategories.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "mb-4 lg:hidden",
						children: /* @__PURE__ */ jsx("div", {
							className: "-mx-4 overflow-x-auto px-4",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex gap-3",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setSelectedSubcategoryId(null),
									className: `min-w-[90px] rounded-lg border px-3 py-2 ${selectedSubcategoryId === null ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`,
									children: "All"
								}), subcategories.map((s) => /* @__PURE__ */ jsxs("button", {
									onClick: () => setSelectedSubcategoryId(s.id),
									className: `min-w-[90px] flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 ${selectedSubcategoryId === s.id ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`,
									children: [/* @__PURE__ */ jsx("div", {
										className: "mb-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted",
										children: s.image_url ? /* @__PURE__ */ jsx("img", {
											src: s.image_url,
											alt: s.name,
											className: "h-full w-full object-cover"
										}) : null
									}), /* @__PURE__ */ jsx("div", {
										className: "text-sm",
										children: s.name
									})]
								}, s.id))]
							})
						})
					}),
					subcategories && subcategories.length > 0 ? /* @__PURE__ */ jsx("div", {
						className: "space-y-8",
						children: (selectedSubcategoryId ? subcategories.filter((s) => s.id === selectedSubcategoryId) : subcategories).map((sub) => {
							const items = displayedProducts.filter((p) => p.subcategory_id === sub.id);
							return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
								className: "mb-3 text-xl font-semibold",
								children: sub.name
							}), items.length === 0 ? /* @__PURE__ */ jsx("div", {
								className: "rounded-xl border bg-card p-6 text-sm text-muted-foreground",
								children: "No products in this subcategory yet."
							}) : /* @__PURE__ */ jsx("div", {
								className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
								children: items.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
							})] }, sub.id);
						})
					}) : sorted.length === 0 ? /* @__PURE__ */ jsx("div", {
						className: "rounded-xl border bg-card p-10 text-center text-muted-foreground",
						children: "No products in this category yet."
					}) : /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
						children: displayedProducts.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
					})
				] })]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };

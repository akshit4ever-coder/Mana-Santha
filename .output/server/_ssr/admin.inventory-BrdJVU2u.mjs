import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as LoaderCircle, S as Plus, T as Minus, b as Search, o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-BrdJVU2u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminInventory() {
	const qc = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const [adjusting, setAdjusting] = (0, import_react.useState)({});
	const [filter, setFilter] = (0, import_react.useState)("all");
	const { data: products, isLoading } = useQuery({
		queryKey: ["admin-inventory"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase.from("products").select("id, name, brand, sku, stock, price, unit, weight, status, categories(name), product_variants(*)").order("stock", { ascending: true });
				if (error) throw error;
				return data;
			} catch (err) {
				const msg = err?.message ?? String(err);
				if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
					const { data, error } = await supabase.from("products").select("id, name, brand, sku, stock, price, unit, weight, status, categories(name)").order("stock", { ascending: true });
					if (error) throw error;
					return data;
				}
				throw err;
			}
		}
	});
	const updateStock = useMutation({
		mutationFn: async ({ id, newStock, reason }) => {
			const { error } = await supabase.from("products").update({
				stock: newStock,
				status: newStock <= 0 ? "out_of_stock" : "active"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: (_, vars) => {
			qc.invalidateQueries({ queryKey: ["admin-inventory"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success(`Stock updated to ${vars.newStock}`);
			setAdjusting((prev) => {
				const n = { ...prev };
				delete n[vars.id];
				return n;
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const filtered = (products ?? []).filter((p) => {
		const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
		const matchFilter = filter === "all" || filter === "out" && p.stock <= 0 || filter === "low" && p.stock > 0 && p.stock < 10;
		return matchSearch && matchFilter;
	});
	const totalProducts = products?.length ?? 0;
	const outOfStock = products?.filter((p) => p.stock <= 0).length ?? 0;
	const lowStock = products?.filter((p) => p.stock > 0 && p.stock < 10).length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold md:text-3xl",
				children: "Inventory"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage stock levels for all products"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter("all"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "all" ? "border-primary bg-primary/5" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "Total Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold",
						children: totalProducts
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter("low"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "low" ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wide text-amber-600",
						children: "Low Stock (<10)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold text-amber-600",
						children: lowStock
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter("out"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "out" ? "border-destructive bg-destructive/5" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium uppercase tracking-wide text-destructive",
						children: "Out of Stock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-2xl font-bold text-destructive",
						children: outOfStock
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search by name, brand, or SKU...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card shadow-card overflow-x-auto",
			children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "SKU" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Price" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stock" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Adjust Stock" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 7,
				className: "py-12 text-center text-muted-foreground",
				children: "No products match your filter"
			}) }) : filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: p.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: p.brand
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: p.categories?.name ?? "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs text-muted-foreground",
					children: p.sku || "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? (() => {
					const active = p.product_variants.filter((v) => v.is_active !== false);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: ["Starting ", formatINR(Math.min(...active.map((v) => Number(v.selling_price ?? v.price ?? 0))))]
					});
				})() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: formatINR(p.price)
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium text-success",
					children: [p.product_variants.reduce((s, v) => s + Number(v.stock || 0), 0), " total"]
				}) : p.stock <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "destructive",
					children: "0 — Out"
				}) : p.stock < 10 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1 h-3 w-3" }), p.stock]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-success",
					children: p.stock
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: p.status === "active" ? "default" : "secondary",
					className: "capitalize",
					children: p.status?.replace(/_/g, " ") || "active"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							className: "h-7 w-7",
							onClick: () => {
								const cur = Number(adjusting[p.id] ?? p.stock);
								setAdjusting((prev) => ({
									...prev,
									[p.id]: String(Math.max(0, cur - 1))
								}));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: "0",
							className: "h-7 w-16 text-center text-sm",
							value: adjusting[p.id] ?? p.stock,
							onChange: (e) => setAdjusting((prev) => ({
								...prev,
								[p.id]: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							className: "h-7 w-7",
							onClick: () => {
								const cur = Number(adjusting[p.id] ?? p.stock);
								setAdjusting((prev) => ({
									...prev,
									[p.id]: String(cur + 1)
								}));
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
						}),
						adjusting[p.id] !== void 0 && adjusting[p.id] !== String(p.stock) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							className: "h-7 rounded-full text-xs",
							onClick: () => updateStock.mutate({
								id: p.id,
								newStock: Number(adjusting[p.id]),
								reason: "Admin adjustment"
							}),
							disabled: updateStock.isPending,
							children: "Save"
						})
					]
				}) })
			] }, p.id)) })] })
		})
	] });
}
//#endregion
export { AdminInventory as component };

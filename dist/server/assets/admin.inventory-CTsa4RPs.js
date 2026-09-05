import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Minus, Plus, Search } from "lucide-react";
//#region src/routes/admin.inventory.tsx?tsr-split=component
function AdminInventory() {
	const qc = useQueryClient();
	const [search, setSearch] = useState("");
	const [adjusting, setAdjusting] = useState({});
	const [filter, setFilter] = useState("all");
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
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold md:text-3xl",
				children: "Inventory"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage stock levels for all products"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ jsxs("button", {
					onClick: () => setFilter("all"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "all" ? "border-primary bg-primary/5" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
						children: "Total Products"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 text-2xl font-bold",
						children: totalProducts
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => setFilter("low"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "low" ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium uppercase tracking-wide text-amber-600",
						children: "Low Stock (<10)"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 text-2xl font-bold text-amber-600",
						children: lowStock
					})]
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: () => setFilter("out"),
					className: `rounded-xl border p-5 text-left shadow-card transition-colors ${filter === "out" ? "border-destructive bg-destructive/5" : "bg-card hover:bg-secondary"}`,
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-xs font-medium uppercase tracking-wide text-destructive",
						children: "Out of Stock"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 text-2xl font-bold text-destructive",
						children: outOfStock
					})]
				})
			]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "mb-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					placeholder: "Search by name, brand, or SKU...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9"
				})]
			})
		}),
		/* @__PURE__ */ jsx("div", {
			className: "rounded-xl border bg-card shadow-card overflow-x-auto",
			children: isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
				/* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Price" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Adjust Stock" })
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
				colSpan: 7,
				className: "py-12 text-center text-muted-foreground",
				children: "No products match your filter"
			}) }) : filtered.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium",
					children: p.name
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: p.brand
				})] }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-sm text-muted-foreground",
					children: p.categories?.name ?? "—"
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-mono text-xs text-muted-foreground",
					children: p.sku || "—"
				}),
				/* @__PURE__ */ jsx(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? (() => {
					const active = p.product_variants.filter((v) => v.is_active !== false);
					const starting = Math.min(...active.map((v) => Number(v.selling_price ?? v.price ?? 0)));
					return /* @__PURE__ */ jsxs("div", {
						className: "font-medium",
						children: ["Starting ", formatINR(starting)]
					});
				})() : /* @__PURE__ */ jsx("div", {
					className: "font-medium",
					children: formatINR(p.price)
				}) }),
				/* @__PURE__ */ jsx(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? /* @__PURE__ */ jsxs("span", {
					className: "font-medium text-success",
					children: [p.product_variants.reduce((s, v) => s + Number(v.stock || 0), 0), " total"]
				}) : p.stock <= 0 ? /* @__PURE__ */ jsx(Badge, {
					variant: "destructive",
					children: "0 — Out"
				}) : p.stock < 10 ? /* @__PURE__ */ jsxs(Badge, {
					className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30",
					children: [/* @__PURE__ */ jsx(AlertTriangle, { className: "mr-1 h-3 w-3" }), p.stock]
				}) : /* @__PURE__ */ jsx("span", {
					className: "font-medium text-success",
					children: p.stock
				}) }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, {
					variant: p.status === "active" ? "default" : "secondary",
					className: "capitalize",
					children: p.status?.replace(/_/g, " ") || "active"
				}) }),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ jsx(Button, {
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
							children: /* @__PURE__ */ jsx(Minus, { className: "h-3 w-3" })
						}),
						/* @__PURE__ */ jsx(Input, {
							type: "number",
							min: "0",
							className: "h-7 w-16 text-center text-sm",
							value: adjusting[p.id] ?? p.stock,
							onChange: (e) => setAdjusting((prev) => ({
								...prev,
								[p.id]: e.target.value
							}))
						}),
						/* @__PURE__ */ jsx(Button, {
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
							children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
						}),
						adjusting[p.id] !== void 0 && adjusting[p.id] !== String(p.stock) && /* @__PURE__ */ jsx(Button, {
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

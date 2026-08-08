import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as Search, j as LoaderCircle, r as Users } from "../_libs/lucide-react.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.customers-C5bigUm4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data: customers, isLoading } = useQuery({
		queryKey: ["admin-customers"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id, full_name, phone, created_at, avatar_url").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const { data: orderCounts } = useQuery({
		queryKey: ["admin-customer-order-counts"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("user_id, total");
			if (error) return {};
			const counts = {};
			data?.forEach((o) => {
				if (!counts[o.user_id]) counts[o.user_id] = {
					count: 0,
					total: 0
				};
				counts[o.user_id].count += 1;
				counts[o.user_id].total += Number(o.total);
			});
			return counts;
		}
	});
	const filtered = (customers ?? []).filter((c) => !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold md:text-3xl",
				children: "Customers"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [customers?.length ?? 0, " registered customers"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-3",
			children: [
				{
					label: "Total Customers",
					value: customers?.length ?? 0,
					icon: Users
				},
				{
					label: "With Orders",
					value: Object.keys(orderCounts ?? {}).length,
					icon: Users
				},
				{
					label: "No Orders Yet",
					value: (customers?.length ?? 0) - Object.keys(orderCounts ?? {}).length,
					icon: Users
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border bg-card p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-2xl font-bold",
					children: s.value
				})]
			}, s.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search by name or phone...",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Phone" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Orders" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Spent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Joined" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "py-12 text-center text-muted-foreground",
				children: "No customers found"
			}) }) : filtered.map((c) => {
				const stats = orderCounts?.[c.id];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold",
							children: c.full_name ? c.full_name.charAt(0).toUpperCase() : "?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: c.full_name || "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs font-mono text-muted-foreground",
							children: [c.id.slice(0, 8), "..."]
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: c.phone || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: stats?.count ?? 0
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: stats ? `₹${stats.total.toLocaleString("en-IN")}` : "₹0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm text-muted-foreground",
						children: new Date(c.created_at).toLocaleDateString("en-IN", {
							day: "numeric",
							month: "short",
							year: "numeric"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: stats?.count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-success text-success-foreground",
						children: "Active"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "New"
					}) })
				] }, c.id);
			}) })] })
		})
	] });
}
//#endregion
export { AdminCustomers as component };

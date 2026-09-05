import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as ShoppingBag, r as Users, s as TrendingUp, w as Package } from "../_libs/lucide-react.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-C5gIe82U.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const { data } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: async () => {
			const [orders, products, todayOrders] = await Promise.all([
				supabase.from("orders").select("id, total, status, created_at"),
				supabase.from("products").select("id, stock"),
				supabase.from("orders").select("id, total").gte("created_at", new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)).toISOString())
			]);
			const totalRevenue = orders.data?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
			const todayRev = todayOrders.data?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
			const pending = orders.data?.filter((o) => o.status === "pending").length ?? 0;
			const outOfStock = products.data?.filter((p) => p.stock <= 0).length ?? 0;
			return {
				totalOrders: orders.data?.length ?? 0,
				totalRevenue,
				todayRev,
				todayOrders: todayOrders.data?.length ?? 0,
				pending,
				outOfStock,
				products: products.data?.length ?? 0
			};
		}
	});
	const stats = [
		{
			label: "Today's Orders",
			value: data?.todayOrders ?? 0,
			icon: ShoppingBag
		},
		{
			label: "Today's Revenue",
			value: formatINR(data?.todayRev ?? 0),
			icon: TrendingUp
		},
		{
			label: "Total Orders",
			value: data?.totalOrders ?? 0,
			icon: Users
		},
		{
			label: "Total Revenue",
			value: formatINR(data?.totalRevenue ?? 0),
			icon: TrendingUp
		},
		{
			label: "Pending Orders",
			value: data?.pending ?? 0,
			icon: ShoppingBag
		},
		{
			label: "Out of Stock",
			value: data?.outOfStock ?? 0,
			icon: Package
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-6 text-2xl font-bold md:text-3xl",
		children: "Dashboard"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-card p-5 shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: s.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-2xl font-bold",
					children: s.value
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
				})]
			})
		}, s.label))
	})] });
}
//#endregion
export { Dashboard as component };

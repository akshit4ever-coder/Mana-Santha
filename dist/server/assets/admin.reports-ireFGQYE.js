import { t as supabase } from "./client-Dxm-ZOZR.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/admin.reports.tsx?tsr-split=component
function AdminReports() {
	const { data, isLoading } = useQuery({
		queryKey: ["admin-reports"],
		queryFn: async () => {
			const [orders, products, profiles] = await Promise.all([
				supabase.from("orders").select("id, total, status, payment_method, created_at").order("created_at", { ascending: true }),
				supabase.from("products").select("id, name, stock, status"),
				supabase.from("profiles").select("id, created_at")
			]);
			const allOrders = orders.data ?? [];
			const allProducts = products.data ?? [];
			const allProfiles = profiles.data ?? [];
			const last30 = /* @__PURE__ */ new Date();
			last30.setDate(last30.getDate() - 30);
			const recentOrders = allOrders.filter((o) => new Date(o.created_at) >= last30);
			const dayMap = {};
			recentOrders.forEach((o) => {
				const d = new Date(o.created_at).toLocaleDateString("en-IN", {
					day: "numeric",
					month: "short"
				});
				if (!dayMap[d]) dayMap[d] = {
					date: d,
					revenue: 0,
					orders: 0
				};
				dayMap[d].revenue += Number(o.total);
				dayMap[d].orders += 1;
			});
			const dailyData = Object.values(dayMap).slice(-14);
			const statusMap = {};
			allOrders.forEach((o) => {
				statusMap[o.status] = (statusMap[o.status] || 0) + 1;
			});
			const statusData = Object.entries(statusMap).map(([status, count]) => ({
				status: status.replace(/_/g, " "),
				count
			}));
			const payMap = {};
			allOrders.forEach((o) => {
				payMap[o.payment_method] = (payMap[o.payment_method] || 0) + 1;
			});
			const totalRevenue = allOrders.reduce((s, o) => s + Number(o.total), 0);
			const today = (/* @__PURE__ */ new Date()).toDateString();
			const todayRevenue = allOrders.filter((o) => new Date(o.created_at).toDateString() === today).reduce((s, o) => s + Number(o.total), 0);
			const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
			const outOfStock = allProducts.filter((p) => p.stock <= 0).length;
			return {
				totalRevenue,
				todayRevenue,
				totalOrders: allOrders.length,
				totalCustomers: allProfiles.length,
				pendingOrders,
				outOfStock,
				dailyData,
				statusData,
				payMap
			};
		}
	});
	if (isLoading) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-center py-12",
		children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
	});
	const summaryCards = [
		{
			label: "Total Revenue",
			value: formatINR(data?.totalRevenue ?? 0),
			icon: TrendingUp,
			color: "text-primary"
		},
		{
			label: "Today's Revenue",
			value: formatINR(data?.todayRevenue ?? 0),
			icon: TrendingUp,
			color: "text-success"
		},
		{
			label: "Total Orders",
			value: data?.totalOrders ?? 0,
			icon: ShoppingBag,
			color: "text-foreground"
		},
		{
			label: "Pending Orders",
			value: data?.pendingOrders ?? 0,
			icon: ShoppingBag,
			color: "text-amber-600"
		},
		{
			label: "Total Customers",
			value: data?.totalCustomers ?? 0,
			icon: Users,
			color: "text-foreground"
		},
		{
			label: "Out of Stock",
			value: data?.outOfStock ?? 0,
			icon: Package,
			color: "text-destructive"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold md:text-3xl",
				children: "Reports"
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground",
				children: "Sales and performance overview"
			})] }),
			/* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: summaryCards.map((s) => /* @__PURE__ */ jsx("div", {
					className: "rounded-xl border bg-card p-5 shadow-card",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ jsx("div", {
							className: `mt-2 text-2xl font-bold ${s.color}`,
							children: s.value
						})] }), /* @__PURE__ */ jsx("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10",
							children: /* @__PURE__ */ jsx(s.icon, { className: `h-5 w-5 ${s.color}` })
						})]
					})
				}, s.label))
			}),
			(data?.dailyData?.length ?? 0) > 0 && /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 text-lg font-semibold",
					children: "Revenue (Last 14 Days)"
				}), /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 280,
					children: /* @__PURE__ */ jsxs(LineChart, {
						data: data?.dailyData,
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								className: "opacity-30"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "date",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ jsx(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false,
								tickFormatter: (v) => `₹${(v / 1e3).toFixed(0)}k`
							}),
							/* @__PURE__ */ jsx(Tooltip, {
								formatter: (v) => [formatINR(v), "Revenue"],
								labelClassName: "font-medium"
							}),
							/* @__PURE__ */ jsx(Line, {
								type: "monotone",
								dataKey: "revenue",
								stroke: "hsl(var(--primary))",
								strokeWidth: 2,
								dot: false,
								activeDot: { r: 4 }
							})
						]
					})
				})]
			}),
			(data?.statusData?.length ?? 0) > 0 && /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 text-lg font-semibold",
					children: "Orders by Status"
				}), /* @__PURE__ */ jsx(ResponsiveContainer, {
					width: "100%",
					height: 220,
					children: /* @__PURE__ */ jsxs(BarChart, {
						data: data?.statusData,
						children: [
							/* @__PURE__ */ jsx(CartesianGrid, {
								strokeDasharray: "3 3",
								className: "opacity-30"
							}),
							/* @__PURE__ */ jsx(XAxis, {
								dataKey: "status",
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ jsx(YAxis, {
								tick: { fontSize: 11 },
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ jsx(Tooltip, {}),
							/* @__PURE__ */ jsx(Bar, {
								dataKey: "count",
								fill: "hsl(var(--primary))",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})]
			}),
			data?.payMap && Object.keys(data.payMap).length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "mb-4 text-lg font-semibold",
					children: "Payment Methods"
				}), /* @__PURE__ */ jsx("div", {
					className: "flex gap-6",
					children: Object.entries(data.payMap).map(([method, count]) => /* @__PURE__ */ jsxs("div", {
						className: "text-center",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-3xl font-bold",
							children: count
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 text-sm font-medium uppercase text-muted-foreground",
							children: method === "cod" ? "Cash on Delivery" : "Online Payment"
						})]
					}, method))
				})]
			})
		]
	});
}
//#endregion
export { AdminReports as component };

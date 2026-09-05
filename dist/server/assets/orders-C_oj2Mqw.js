import { a as useAuth } from "./router-DKDYeeFZ.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { a as useOrders, t as Header } from "./Header-BVbnzp4q.js";
import { t as Footer } from "./Footer-CfwbBDT3.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Package } from "lucide-react";
//#region src/routes/orders.tsx?tsr-split=component
var statusColor = {
	pending: "bg-yellow-500/15 text-yellow-700",
	confirmed: "bg-blue-500/15 text-blue-700",
	packed: "bg-purple-500/15 text-purple-700",
	out_for_delivery: "bg-orange-500/15 text-orange-700",
	delivered: "bg-green-500/15 text-green-700",
	cancelled: "bg-red-500/15 text-red-700",
	refunded: "bg-gray-500/15 text-gray-700"
};
function OrdersPage() {
	const { user } = useAuth();
	const { data: orders } = useOrders(user?.id);
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsxs("div", {
			className: "py-20 text-center",
			children: [
				"Please ",
				/* @__PURE__ */ jsx(Link, {
					to: "/auth",
					className: "text-primary underline",
					children: "sign in"
				}),
				"."
			]
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Header, {}),
			/* @__PURE__ */ jsxs("main", {
				className: "container mx-auto px-4 py-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "mb-6 text-2xl font-bold md:text-3xl",
					children: "My Orders"
				}), !orders || orders.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl border bg-card p-16 text-center shadow-card",
					children: [
						/* @__PURE__ */ jsx(Package, { className: "mx-auto mb-4 h-12 w-12 text-muted-foreground" }),
						/* @__PURE__ */ jsx("p", {
							className: "text-lg font-semibold",
							children: "No orders yet"
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "mt-4 inline-block text-primary underline",
							children: "Start shopping"
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: orders.map((o) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "text-sm text-muted-foreground",
								children: ["Order #", o.order_number]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs text-muted-foreground",
								children: new Date(o.created_at).toLocaleString("en-IN")
							})] }), /* @__PURE__ */ jsx(Badge, {
								className: statusColor[o.status] ?? "",
								children: o.status.replace(/_/g, " ")
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-[1fr_auto]",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "rounded-lg border bg-secondary/20 p-3 text-sm",
									children: [
										/* @__PURE__ */ jsx("div", {
											className: "text-[10px] uppercase tracking-wide text-muted-foreground",
											children: "Delivery to"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "mt-1 font-medium",
											children: o.address_snapshot?.full_name || user.full_name || "Customer"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: o.address_snapshot?.phone || user.phone || "Phone not available"
										}),
										/* @__PURE__ */ jsx("div", {
											className: "text-muted-foreground",
											children: [
												o.address_snapshot?.line1,
												o.address_snapshot?.line2,
												o.address_snapshot?.city,
												o.address_snapshot?.state,
												o.address_snapshot?.pincode
											].filter(Boolean).join(", ") || "Address not available"
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap gap-2",
									children: [o.order_items?.slice(0, 4).map((it) => /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2 rounded-lg border bg-secondary/40 px-2 py-1 text-xs",
										children: [
											/* @__PURE__ */ jsx("img", {
												src: it.image_url ?? "",
												alt: "",
												className: "h-8 w-8 rounded object-cover"
											}),
											/* @__PURE__ */ jsx("span", {
												className: "line-clamp-1 max-w-40",
												children: it.name
											}),
											/* @__PURE__ */ jsxs("span", {
												className: "text-muted-foreground",
												children: ["× ", it.quantity]
											})
										]
									}, it.id)), o.order_items?.length > 4 && /* @__PURE__ */ jsxs("div", {
										className: "rounded-lg bg-secondary px-2 py-1 text-xs",
										children: [
											"+",
											o.order_items.length - 4,
											" more"
										]
									})]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-right",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: "Total"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xl font-bold",
										children: formatINR(o.total)
									}),
									/* @__PURE__ */ jsx("div", {
										className: "text-xs text-muted-foreground",
										children: o.payment_method === "cod" ? "Cash on Delivery" : "Paid online"
									})
								]
							})]
						})]
					}, o.id))
				})]
			}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
//#endregion
export { OrdersPage as component };

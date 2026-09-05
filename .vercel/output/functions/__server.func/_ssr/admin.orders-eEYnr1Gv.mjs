import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders-eEYnr1Gv.js
var import_jsx_runtime = require_jsx_runtime();
var STATUSES = [
	"pending",
	"confirmed",
	"packed",
	"out_for_delivery",
	"delivered",
	"cancelled",
	"refunded"
];
var formatDeliveryAddress = (snapshot) => {
	if (!snapshot) return "Address not available";
	return [
		snapshot.line1,
		snapshot.line2,
		snapshot.city,
		snapshot.state,
		snapshot.pincode
	].filter(Boolean).join(", ");
};
function AdminOrders() {
	const qc = useQueryClient();
	const { data: orders } = useQuery({
		queryKey: ["admin-orders"],
		queryFn: async () => (await supabase.from("orders").select("*, order_items(*), profiles: user_id(full_name, phone)").order("created_at", { ascending: false })).data
	});
	const upd = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("orders").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-orders"] });
			toast.success("Order updated");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-4 text-2xl font-bold md:text-3xl",
		children: "Orders"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Delivery" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Items" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payment" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: orders?.map((o) => {
			const customerName = o.profiles?.full_name || o.address_snapshot?.full_name || "Unknown customer";
			const customerPhone = o.profiles?.phone || o.address_snapshot?.phone || "No phone";
			const deliveryAddress = formatDeliveryAddress(o.address_snapshot);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: o.order_number
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: new Date(o.created_at).toLocaleString("en-IN")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: customerName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: customerPhone
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-[220px]",
						children: deliveryAddress
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [o.address_snapshot?.city || "City not available", o.address_snapshot?.state ? `, ${o.address_snapshot.state}` : ""]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: o.order_items?.length }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-semibold",
					children: formatINR(o.total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm uppercase",
					children: o.payment_method
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: o.status,
					onValueChange: (v) => upd.mutate({
						id: o.id,
						status: v
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s,
						children: s.replace(/_/g, " ")
					}, s)) })]
				}) })
			] }, o.id);
		}) })] })
	})] });
}
//#endregion
export { AdminOrders as component };

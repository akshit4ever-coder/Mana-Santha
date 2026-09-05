import { t as supabase } from "./client-Dxm-ZOZR.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
//#region src/routes/admin.orders.tsx?tsr-split=component
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
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
		className: "mb-4 text-2xl font-bold md:text-3xl",
		children: "Orders"
	}), /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border bg-card shadow-card",
		children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableHead, { children: "Order" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Delivery" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Items" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Total" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Payment" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Status" })
		] }) }), /* @__PURE__ */ jsx(TableBody, { children: orders?.map((o) => {
			const customerName = o.profiles?.full_name || o.address_snapshot?.full_name || "Unknown customer";
			const customerPhone = o.profiles?.phone || o.address_snapshot?.phone || "No phone";
			const deliveryAddress = formatDeliveryAddress(o.address_snapshot);
			return /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium",
					children: o.order_number
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: new Date(o.created_at).toLocaleString("en-IN")
				})] }),
				/* @__PURE__ */ jsxs(TableCell, {
					className: "text-sm",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: customerName
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: customerPhone
					})]
				}),
				/* @__PURE__ */ jsxs(TableCell, {
					className: "text-sm",
					children: [/* @__PURE__ */ jsx("div", {
						className: "max-w-[220px]",
						children: deliveryAddress
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-xs text-muted-foreground",
						children: [o.address_snapshot?.city || "City not available", o.address_snapshot?.state ? `, ${o.address_snapshot.state}` : ""]
					})]
				}),
				/* @__PURE__ */ jsx(TableCell, { children: o.order_items?.length }),
				/* @__PURE__ */ jsx(TableCell, {
					className: "font-semibold",
					children: formatINR(o.total)
				}),
				/* @__PURE__ */ jsx(TableCell, {
					className: "text-sm uppercase",
					children: o.payment_method
				}),
				/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Select, {
					value: o.status,
					onValueChange: (v) => upd.mutate({
						id: o.id,
						status: v
					}),
					children: [/* @__PURE__ */ jsx(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ jsx(SelectValue, {})
					}), /* @__PURE__ */ jsx(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, {
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

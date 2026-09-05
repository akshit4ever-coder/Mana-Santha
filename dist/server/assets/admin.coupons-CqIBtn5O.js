import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-CCehujYb.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react";
//#region src/routes/admin.coupons.tsx?tsr-split=component
function AdminCoupons() {
	const qc = useQueryClient();
	const [editing, setEditing] = useState(null);
	const [open, setOpen] = useState(false);
	const { data: coupons, isLoading } = useQuery({
		queryKey: ["admin-coupons"],
		queryFn: async () => {
			const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (c) => {
			const payload = {
				code: c.code.toUpperCase().trim(),
				description: c.description || null,
				discount_type: c.discount_type,
				discount_value: Number(c.discount_value),
				max_discount: c.max_discount ? Number(c.max_discount) : null,
				min_cart_value: Number(c.min_cart_value) || 0,
				usage_limit: c.usage_limit ? Number(c.usage_limit) : null,
				per_user_limit: Number(c.per_user_limit) || 1,
				active_from: c.active_from || (/* @__PURE__ */ new Date()).toISOString(),
				active_till: c.active_till || null,
				is_active: c.is_active !== false
			};
			if (c.id) {
				const { error } = await supabase.from("coupons").update(payload).eq("id", c.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("coupons").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-coupons"] });
			toast.success("Coupon saved");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] })
	});
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Coupons"
		}), /* @__PURE__ */ jsxs("p", {
			className: "text-sm text-muted-foreground",
			children: [coupons?.length ?? 0, " coupons created"]
		})] }), /* @__PURE__ */ jsxs(Dialog, {
			open,
			onOpenChange: (o) => {
				setOpen(o);
				if (!o) setEditing(null);
			},
			children: [/* @__PURE__ */ jsx(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsxs(Button, {
					className: "rounded-full",
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "New Coupon"]
				})
			}), /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Coupon"] }) }), /* @__PURE__ */ jsx(CouponForm, {
					initial: editing,
					onSave: (c) => save.mutate(c),
					pending: save.isPending
				})]
			})]
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border bg-card shadow-card overflow-x-auto",
		children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableHead, { children: "Code" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Discount" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Min Cart" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Usage" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Valid Till" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
			/* @__PURE__ */ jsx(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ jsx(TableBody, { children: coupons?.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
			colSpan: 7,
			className: "py-12 text-center text-muted-foreground",
			children: "No coupons yet. Create your first coupon!"
		}) }) : coupons?.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("code", {
				className: "rounded bg-muted px-2 py-0.5 font-mono font-bold text-primary",
				children: c.code
			}), c.description && /* @__PURE__ */ jsx("div", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: c.description
			})] }),
			/* @__PURE__ */ jsxs(TableCell, {
				className: "font-medium",
				children: [c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `${formatINR(c.discount_value)} OFF`, c.max_discount && /* @__PURE__ */ jsxs("div", {
					className: "text-xs text-muted-foreground",
					children: ["max ", formatINR(c.max_discount)]
				})]
			}),
			/* @__PURE__ */ jsx(TableCell, { children: formatINR(c.min_cart_value) }),
			/* @__PURE__ */ jsxs(TableCell, { children: [c.used_count, c.usage_limit && ` / ${c.usage_limit}`] }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "text-sm text-muted-foreground",
				children: c.active_till ? new Date(c.active_till).toLocaleDateString("en-IN") : "No expiry"
			}),
			/* @__PURE__ */ jsx(TableCell, { children: c.is_active ? /* @__PURE__ */ jsx(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				children: "Inactive"
			}) }),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-end gap-1",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					title: c.is_active ? "Deactivate" : "Activate",
					onClick: () => toggle.mutate({
						id: c.id,
						is_active: !c.is_active
					}),
					children: c.is_active ? /* @__PURE__ */ jsx(ToggleRight, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "h-4 w-4 text-muted-foreground" })
				}), /* @__PURE__ */ jsx(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => {
						setEditing(c);
						setOpen(true);
					},
					children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
				})]
			}) })
		] }, c.id)) })] })
	})] });
}
function CouponForm({ initial, onSave, pending }) {
	const [c, setC] = useState(initial ?? {
		code: "",
		description: "",
		discount_type: "percentage",
		discount_value: 10,
		max_discount: "",
		min_cart_value: 0,
		usage_limit: "",
		per_user_limit: 1,
		active_from: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		active_till: "",
		is_active: true
	});
	const set = (k, v) => setC((prev) => ({
		...prev,
		[k]: v
	}));
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSave(c);
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Coupon Code *" }), /* @__PURE__ */ jsx(Input, {
					required: true,
					value: c.code,
					onChange: (e) => set("code", e.target.value.toUpperCase()),
					placeholder: "SAVE10"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Discount Type *" }), /* @__PURE__ */ jsxs(Select, {
					value: c.discount_type,
					onValueChange: (v) => set("discount_type", v),
					children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [/* @__PURE__ */ jsx(SelectItem, {
						value: "percentage",
						children: "Percentage (%)"
					}), /* @__PURE__ */ jsx(SelectItem, {
						value: "flat",
						children: "Flat Amount (₹)"
					})] })]
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Label, { children: [
					"Discount Value *",
					" ",
					c.discount_type === "percentage" ? "(%)" : "(₹)"
				] }), /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: "0",
					required: true,
					value: c.discount_value,
					onChange: (e) => set("discount_value", e.target.value)
				})] }), c.discount_type === "percentage" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Max Discount (₹)" }), /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: "0",
					value: c.max_discount ?? "",
					onChange: (e) => set("max_discount", e.target.value),
					placeholder: "Optional cap"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Description" }), /* @__PURE__ */ jsx(Input, {
				value: c.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short description for this coupon"
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Min Cart Value (₹)" }), /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: "0",
					value: c.min_cart_value,
					onChange: (e) => set("min_cart_value", e.target.value)
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Usage Limit (total)" }), /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: "1",
					value: c.usage_limit ?? "",
					onChange: (e) => set("usage_limit", e.target.value),
					placeholder: "Unlimited"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Valid From" }), /* @__PURE__ */ jsx(Input, {
					type: "date",
					value: c.active_from?.slice(0, 10),
					onChange: (e) => set("active_from", e.target.value)
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Valid Till" }), /* @__PURE__ */ jsx(Input, {
					type: "date",
					value: c.active_till?.slice(0, 10) ?? "",
					onChange: (e) => set("active_till", e.target.value)
				})] })]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-2 text-sm cursor-pointer",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: c.is_active !== false,
					onChange: (e) => set("is_active", e.target.checked),
					className: "h-4 w-4 rounded"
				}), "Active (visible to customers)"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "submit",
				disabled: pending,
				className: "w-full rounded-full",
				children: [pending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Coupon" : "Create Coupon"]
			})
		]
	});
}
//#endregion
export { AdminCoupons as component };

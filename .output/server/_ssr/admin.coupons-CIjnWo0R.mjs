import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Plus, j as LoaderCircle, l as ToggleRight, u as ToggleLeft, w as Pencil } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.mjs";
import { n as formatINR } from "./format-S14ZKO36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.coupons-CIjnWo0R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCoupons() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Coupons"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [coupons?.length ?? 0, " coupons created"]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: (o) => {
				setOpen(o);
				if (!o) setEditing(null);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "rounded-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Coupon"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Coupon"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CouponForm, {
					initial: editing,
					onSave: (c) => save.mutate(c),
					pending: save.isPending
				})]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card shadow-card overflow-x-auto",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Code" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Discount" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Min Cart" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Usage" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Valid Till" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: coupons?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 7,
			className: "py-12 text-center text-muted-foreground",
			children: "No coupons yet. Create your first coupon!"
		}) }) : coupons?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "rounded bg-muted px-2 py-0.5 font-mono font-bold text-primary",
				children: c.code
			}), c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: c.description
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: "font-medium",
				children: [c.discount_type === "percentage" ? `${c.discount_value}% OFF` : `${formatINR(c.discount_value)} OFF`, c.max_discount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: ["max ", formatINR(c.max_discount)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatINR(c.min_cart_value) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [c.used_count, c.usage_limit && ` / ${c.usage_limit}`] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-sm text-muted-foreground",
				children: c.active_till ? new Date(c.active_till).toLocaleDateString("en-IN") : "No expiry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: "Inactive"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					title: c.is_active ? "Deactivate" : "Activate",
					onClick: () => toggle.mutate({
						id: c.id,
						is_active: !c.is_active
					}),
					children: c.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRight, { className: "h-4 w-4 text-success" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleLeft, { className: "h-4 w-4 text-muted-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => {
						setEditing(c);
						setOpen(true);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
				})]
			}) })
		] }, c.id)) })] })
	})] });
}
function CouponForm({ initial, onSave, pending }) {
	const [c, setC] = (0, import_react.useState)(initial ?? {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSave(c);
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Coupon Code *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					value: c.code,
					onChange: (e) => set("code", e.target.value.toUpperCase()),
					placeholder: "SAVE10"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Discount Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: c.discount_type,
					onValueChange: (v) => set("discount_type", v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "percentage",
						children: "Percentage (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "flat",
						children: "Flat Amount (₹)"
					})] })]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
					"Discount Value *",
					" ",
					c.discount_type === "percentage" ? "(%)" : "(₹)"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "0",
					required: true,
					value: c.discount_value,
					onChange: (e) => set("discount_value", e.target.value)
				})] }), c.discount_type === "percentage" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Max Discount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "0",
					value: c.max_discount ?? "",
					onChange: (e) => set("max_discount", e.target.value),
					placeholder: "Optional cap"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: c.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short description for this coupon"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Min Cart Value (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "0",
					value: c.min_cart_value,
					onChange: (e) => set("min_cart_value", e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Usage Limit (total)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					min: "1",
					value: c.usage_limit ?? "",
					onChange: (e) => set("usage_limit", e.target.value),
					placeholder: "Unlimited"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valid From" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: c.active_from?.slice(0, 10),
					onChange: (e) => set("active_from", e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valid Till" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: c.active_till?.slice(0, 10) ?? "",
					onChange: (e) => set("active_till", e.target.value)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: c.is_active !== false,
					onChange: (e) => set("is_active", e.target.checked),
					className: "h-4 w-4 rounded"
				}), "Active (visible to customers)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: pending,
				className: "w-full rounded-full",
				children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Coupon" : "Create Coupon"]
			})
		]
	});
}
//#endregion
export { AdminCoupons as component };

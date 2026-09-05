import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-CCehujYb.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bike, Loader2, Pencil, Plus, Star } from "lucide-react";
//#region src/routes/admin.delivery.tsx?tsr-split=component
function AdminDelivery() {
	const qc = useQueryClient();
	const [editing, setEditing] = useState(null);
	const [open, setOpen] = useState(false);
	const { data: partners, isLoading } = useQuery({
		queryKey: ["admin-delivery-partners"],
		queryFn: async () => {
			const { data, error } = await supabase.from("delivery_partners").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (p) => {
			const payload = {
				name: p.name,
				phone: p.phone,
				email: p.email || null,
				vehicle_number: p.vehicle_number || null,
				vehicle_type: p.vehicle_type || "bike",
				is_active: p.is_active !== false
			};
			if (p.id) {
				const { error } = await supabase.from("delivery_partners").update(payload).eq("id", p.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("delivery_partners").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
			toast.success("Delivery partner saved");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("delivery_partners").update({ is_active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-delivery-partners"] })
	});
	const activeCount = partners?.filter((p) => p.is_active).length ?? 0;
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Delivery Partners"
		}), /* @__PURE__ */ jsxs("p", {
			className: "text-sm text-muted-foreground",
			children: [
				activeCount,
				" active · ",
				partners?.length ?? 0,
				" total"
			]
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Partner"]
				})
			}), /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [editing?.id ? "Edit" : "Add", " Delivery Partner"] }) }), /* @__PURE__ */ jsx(PartnerForm, {
					initial: editing,
					onSave: (p) => save.mutate(p),
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
			/* @__PURE__ */ jsx(TableHead, { children: "Partner" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Phone" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Vehicle" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Rating" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Deliveries" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
			/* @__PURE__ */ jsx(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ jsx(TableBody, { children: partners?.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, {
			colSpan: 7,
			className: "py-12 text-center text-muted-foreground",
			children: [/* @__PURE__ */ jsx(Bike, { className: "mx-auto mb-2 h-10 w-10 opacity-30" }), "No delivery partners yet. Add your first partner!"]
		}) }) : partners?.map((p) => /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm",
					children: p.name.charAt(0).toUpperCase()
				}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
					className: "font-medium",
					children: p.name
				}), p.email && /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground",
					children: p.email
				})] })]
			}) }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "text-sm",
				children: p.phone
			}),
			/* @__PURE__ */ jsxs(TableCell, { children: [/* @__PURE__ */ jsx("div", {
				className: "text-sm capitalize",
				children: p.vehicle_type || "bike"
			}), p.vehicle_number && /* @__PURE__ */ jsx("div", {
				className: "font-mono text-xs text-muted-foreground",
				children: p.vehicle_number
			})] }),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("span", {
				className: "flex items-center gap-1 text-sm font-medium",
				children: [/* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 fill-amber-400 text-amber-400" }), Number(p.rating).toFixed(1)]
			}) }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "font-medium",
				children: p.total_deliveries
			}),
			/* @__PURE__ */ jsx(TableCell, { children: p.is_active ? /* @__PURE__ */ jsx(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				children: "Inactive"
			}) }),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-end gap-1",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "sm",
					variant: p.is_active ? "outline" : "default",
					className: "h-7 rounded-full text-xs",
					onClick: () => toggle.mutate({
						id: p.id,
						is_active: !p.is_active
					}),
					children: p.is_active ? "Deactivate" : "Activate"
				}), /* @__PURE__ */ jsx(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => {
						setEditing(p);
						setOpen(true);
					},
					children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
				})]
			}) })
		] }, p.id)) })] })
	})] });
}
function PartnerForm({ initial, onSave, pending }) {
	const [p, setP] = useState(initial ?? {
		name: "",
		phone: "",
		email: "",
		vehicle_number: "",
		vehicle_type: "bike",
		is_active: true
	});
	const set = (k, v) => setP((prev) => ({
		...prev,
		[k]: v
	}));
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSave(p);
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Full Name *" }), /* @__PURE__ */ jsx(Input, {
				required: true,
				value: p.name,
				onChange: (e) => set("name", e.target.value),
				placeholder: "Partner name"
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Phone *" }), /* @__PURE__ */ jsx(Input, {
					required: true,
					type: "tel",
					value: p.phone,
					onChange: (e) => set("phone", e.target.value),
					placeholder: "10-digit number"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Email" }), /* @__PURE__ */ jsx(Input, {
					type: "email",
					value: p.email ?? "",
					onChange: (e) => set("email", e.target.value),
					placeholder: "Optional"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Vehicle Type" }), /* @__PURE__ */ jsxs(Select, {
					value: p.vehicle_type,
					onValueChange: (v) => set("vehicle_type", v),
					children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
						/* @__PURE__ */ jsx(SelectItem, {
							value: "bike",
							children: "🏍️ Bike"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "bicycle",
							children: "🚲 Bicycle"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "scooter",
							children: "🛵 Scooter"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "car",
							children: "🚗 Car"
						}),
						/* @__PURE__ */ jsx(SelectItem, {
							value: "auto",
							children: "🛺 Auto"
						})
					] })]
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Vehicle Number" }), /* @__PURE__ */ jsx(Input, {
					value: p.vehicle_number ?? "",
					onChange: (e) => set("vehicle_number", e.target.value.toUpperCase()),
					placeholder: "AP 01 AB 1234"
				})] })]
			}),
			/* @__PURE__ */ jsxs("label", {
				className: "flex items-center gap-2 text-sm cursor-pointer",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: p.is_active !== false,
					onChange: (e) => set("is_active", e.target.checked),
					className: "h-4 w-4 rounded"
				}), "Active (available for deliveries)"]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "submit",
				disabled: pending,
				className: "w-full rounded-full",
				children: [pending && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Partner" : "Add Partner"]
			})
		]
	});
}
//#endregion
export { AdminDelivery as component };

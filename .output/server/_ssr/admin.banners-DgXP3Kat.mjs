import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as EyeOff, I as Image, S as Plus, j as LoaderCircle, w as Pencil, z as Eye } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.banners-DgXP3Kat.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminBanners() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: banners, isLoading } = useQuery({
		queryKey: ["admin-banners"],
		queryFn: async () => {
			const { data, error } = await supabase.from("banners").select("*").order("position");
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (b) => {
			const payload = {
				title: b.title,
				description: b.description || null,
				image_url: b.image_url,
				link_url: b.link_url || null,
				position: Number(b.position) || 0,
				is_active: b.is_active !== false,
				valid_from: b.valid_from || (/* @__PURE__ */ new Date()).toISOString(),
				valid_till: b.valid_till || null
			};
			if (b.id) {
				const { error } = await supabase.from("banners").update(payload).eq("id", b.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("banners").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-banners"] });
			toast.success("Banner saved");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("banners").update({ is_active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Banners"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [banners?.length ?? 0, " banners"]
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Banner"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-lg max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Banner"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BannerForm, {
					initial: editing,
					onSave: (b) => save.mutate(b),
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Image" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Title" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Position" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Valid Till" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: banners?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			colSpan: 6,
			className: "py-12 text-center text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto mb-2 h-10 w-10 opacity-30" }), "No banners yet. Create your first banner!"]
		}) }) : banners?.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: b.image_url,
				alt: b.title,
				className: "h-14 w-24 rounded-lg object-cover border",
				onError: (e) => {
					e.target.style.display = "none";
				}
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: b.title
				}),
				b.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground truncate max-w-xs",
					children: b.description
				}),
				b.link_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-primary truncate max-w-xs",
					children: ["→ ", b.link_url]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: b.position }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-sm text-muted-foreground",
				children: b.valid_till ? new Date(b.valid_till).toLocaleDateString("en-IN") : "No expiry"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: b.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: "Hidden"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => toggle.mutate({
						id: b.id,
						is_active: !b.is_active
					}),
					children: b.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4 text-muted-foreground" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => {
						setEditing(b);
						setOpen(true);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
				})]
			}) })
		] }, b.id)) })] })
	})] });
}
function BannerForm({ initial, onSave, pending }) {
	const [b, setB] = (0, import_react.useState)(initial ?? {
		title: "",
		description: "",
		image_url: "",
		link_url: "",
		position: 0,
		valid_from: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		valid_till: "",
		is_active: true
	});
	const set = (k, v) => setB((prev) => ({
		...prev,
		[k]: v
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			onSave(b);
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Title *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				required: true,
				value: b.title,
				onChange: (e) => set("title", e.target.value),
				placeholder: "Summer Sale — Up to 30% Off"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: b.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short subtitle for the banner"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL *" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "url",
					required: true,
					value: b.image_url,
					onChange: (e) => set("image_url", e.target.value),
					placeholder: "https://..."
				}),
				b.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: b.image_url,
					alt: "preview",
					className: "mt-2 h-24 w-full rounded-lg object-cover border",
					onError: (e) => {
						e.target.style.display = "none";
					}
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Link URL (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "url",
				value: b.link_url ?? "",
				onChange: (e) => set("link_url", e.target.value),
				placeholder: "/category/fruits-vegetables"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Position" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: "0",
						value: b.position,
						onChange: (e) => set("position", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valid From" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: b.valid_from?.slice(0, 10),
						onChange: (e) => set("valid_from", e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Valid Till" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: b.valid_till?.slice(0, 10) ?? "",
						onChange: (e) => set("valid_till", e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: b.is_active !== false,
					onChange: (e) => set("is_active", e.target.checked),
					className: "h-4 w-4 rounded"
				}), "Active (show on homepage)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: pending,
				className: "w-full rounded-full",
				children: [pending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Banner" : "Create Banner"]
			})
		]
	});
}
//#endregion
export { AdminBanners as component };

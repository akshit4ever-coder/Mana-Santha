import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-BvGaYObg.mjs";
import { t as supabase } from "./client-Dxm-ZOZR.mjs";
import { t as Input } from "./input-Ceah8uUG.mjs";
import { t as Label } from "./label-CWAXRbd-.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as EyeOff, S as Plus, f as Tag, j as LoaderCircle, t as X, w as Pencil, z as Eye } from "../_libs/lucide-react.mjs";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.mjs";
import { t as Badge } from "./badge-Dw1JS-RI.mjs";
import { o as uploadImageToBucket, t as ALLOWED_IMAGE_TYPES } from "./product-storage-C7t5u44h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-BghGOD-O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCategories() {
	const qc = useQueryClient();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: categories, isLoading } = useQuery({
		queryKey: ["admin-categories-full"],
		queryFn: async () => {
			const { data, error } = await supabase.from("categories").select("*").order("name");
			if (error) throw error;
			return data;
		}
	});
	const save = useMutation({
		mutationFn: async (c) => {
			const payload = {
				name: c.name,
				slug: c.slug,
				description: c.description || null,
				icon: c.icon || null,
				image_url: c.image_url || null,
				is_active: c.is_active !== false
			};
			const { data: existing, error: lookupError } = await supabase.from("categories").select("id").ilike("name", c.name.trim()).maybeSingle();
			if (lookupError) throw lookupError;
			if (existing && existing.id !== c.id) throw new Error("A category with this name already exists.");
			if (c.id) {
				const { error } = await supabase.from("categories").update(payload).eq("id", c.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("categories").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
			qc.invalidateQueries({ queryKey: ["admin-categories"] });
			toast.success("Category saved");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("categories").update({ is_active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
			qc.invalidateQueries({ queryKey: ["admin-categories"] });
		}
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
			qc.invalidateQueries({ queryKey: ["admin-categories"] });
			toast.success("Category deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Categories"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [categories?.length ?? 0, " categories"]
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "New Category"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Category"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryForm, {
					initial: editing,
					onSave: (c) => save.mutate(c),
					pending: save.isPending
				})]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card shadow-card",
		children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Icon" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Name" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Slug" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: categories?.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl",
				children: c.icon || "📦"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: c.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs text-muted-foreground",
				children: c.slug
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: "Hidden"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						title: c.is_active ? "Hide" : "Show",
						onClick: () => toggle.mutate({
							id: c.id,
							is_active: !c.is_active
						}),
						children: c.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8",
						onClick: () => {
							setEditing(c);
							setOpen(true);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						className: "h-8 w-8 text-destructive",
						title: "Delete category",
						onClick: () => {
							if (confirm(`Delete "${c.name}" and its subcategories/products?`)) remove.mutate(c.id);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4" })
					})
				]
			}) })
		] }, c.id)) })] })
	})] });
}
function CategoryForm({ initial, onSave, pending }) {
	const fileInputRef = (0, import_react.useRef)(null);
	const [imageFile, setImageFile] = (0, import_react.useState)(null);
	const [imagePreview, setImagePreview] = (0, import_react.useState)(initial?.image_url ?? null);
	const [imageError, setImageError] = (0, import_react.useState)(null);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	const [c, setC] = (0, import_react.useState)(initial ?? {
		name: "",
		slug: "",
		description: "",
		icon: "",
		image_url: "",
		is_active: true
	});
	const set = (k, v) => setC((prev) => ({
		...prev,
		[k]: v
	}));
	(0, import_react.useEffect)(() => {
		setC(initial ?? {
			name: "",
			slug: "",
			description: "",
			icon: "",
			image_url: "",
			is_active: true
		});
		setImageFile(null);
		setImagePreview(initial?.image_url ?? null);
		setImageError(null);
	}, [initial?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			const trimmedName = (c.name || "").trim();
			const trimmedSlug = (c.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "category").trim();
			if (!trimmedName || !trimmedSlug) {
				toast.error("Please enter a category name and slug.");
				return;
			}
			try {
				let finalImageUrl = c.image_url || null;
				if (imageFile) {
					setIsUploading(true);
					finalImageUrl = await uploadImageToBucket(imageFile, "categories", trimmedName, "category");
				}
				onSave({
					...c,
					name: trimmedName,
					slug: trimmedSlug,
					description: c.description || null,
					image_url: finalImageUrl
				});
			} catch (error) {
				toast.error(error?.message || "Failed to upload image");
			} finally {
				setIsUploading(false);
			}
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					required: true,
					value: c.name,
					onChange: (e) => {
						set("name", e.target.value);
						if (!initial?.id) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
					},
					placeholder: "Category name"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Icon (Emoji)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: c.icon ?? "",
					onChange: (e) => set("icon", e.target.value),
					placeholder: "🥬",
					maxLength: 4
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				required: true,
				value: c.slug,
				onChange: (e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")),
				placeholder: "fruits-vegetables"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: c.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short description"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end pb-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: c.is_active !== false,
						onChange: (e) => set("is_active", e.target.checked),
						className: "h-4 w-4 rounded"
					}), "Active / Visible"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Upload Image" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center",
					children: [imagePreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: imagePreview,
						alt: "category preview",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-8 w-8 text-muted-foreground/50" }), imagePreview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "icon",
						variant: "destructive",
						className: "absolute right-1 top-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100",
						onClick: () => {
							setImageFile(null);
							setImagePreview(null);
							set("image_url", "");
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/jpeg,image/png,image/webp",
							className: "hidden",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
									setImageError("Only JPG, JPEG, PNG, and WEBP files are supported.");
									setImageFile(null);
									return;
								}
								if (file.size > 5242880) {
									setImageError("Image must be 5MB or smaller.");
									setImageFile(null);
									return;
								}
								setImageError(null);
								setImageFile(file);
								setImagePreview(URL.createObjectURL(file));
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "mb-2",
							onClick: () => fileInputRef.current?.click(),
							children: imagePreview ? "Replace Image" : "Upload Image"
						}),
						imageError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-sm text-destructive",
							children: imageError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "JPG, JPEG, PNG, or WEBP. Max size 5MB."
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: pending || isUploading,
				className: "w-full rounded-full",
				children: [(pending || isUploading) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Category" : "Create Category"]
			})
		]
	});
}
//#endregion
export { AdminCategories as component };

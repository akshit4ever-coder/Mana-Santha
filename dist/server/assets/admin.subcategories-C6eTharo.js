import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { s as uploadImageToBucket, t as ALLOWED_IMAGE_TYPES } from "./product-storage-CLqEGs3S.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pencil, Plus, Tag, X } from "lucide-react";
//#region src/routes/admin.subcategories.tsx?tsr-split=component
function AdminSubcategories() {
	const qc = useQueryClient();
	const [editing, setEditing] = useState(null);
	const [open, setOpen] = useState(false);
	const { data: categories } = useQuery({
		queryKey: ["admin-categories"],
		queryFn: async () => (await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")).data ?? []
	});
	const { data: subcategories, isLoading } = useQuery({
		queryKey: ["admin-subcategories"],
		queryFn: async () => {
			const { data, error } = await supabase.from("subcategories").select("*, categories(name)").order("name");
			if (error) throw error;
			return data ?? [];
		}
	});
	const save = useMutation({
		mutationFn: async (item) => {
			const payload = {
				category_id: item.category_id || null,
				category_name: item.category_name || null,
				name: item.name?.trim(),
				slug: item.slug?.trim() || null,
				description: item.description || null,
				image_url: item.image_url || null,
				is_active: item.is_active !== false
			};
			if (!payload.category_id) throw new Error("Please select a category");
			if (!payload.name) throw new Error("Please enter a subcategory name");
			const { data: existing, error: lookupError } = await supabase.from("subcategories").select("id").eq("category_id", payload.category_id).ilike("name", payload.name).maybeSingle();
			if (lookupError) throw lookupError;
			if (existing && existing.id !== item.id) throw new Error("A subcategory with this name already exists in that category.");
			if (item.id) {
				const { error } = await supabase.from("subcategories").update(payload).eq("id", item.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("subcategories").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-subcategories"] });
			qc.invalidateQueries({ queryKey: ["subcategories"] });
			toast.success("Subcategory saved");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("subcategories").update({ is_active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-subcategories"] });
			qc.invalidateQueries({ queryKey: ["subcategories"] });
		}
	});
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-6 flex items-center justify-between",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold md:text-3xl",
			children: "Subcategories"
		}), /* @__PURE__ */ jsxs("p", {
			className: "text-sm text-muted-foreground",
			children: [subcategories?.length ?? 0, " subcategories"]
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
					children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "New Subcategory"]
				})
			}), /* @__PURE__ */ jsxs(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Subcategory"] }) }), /* @__PURE__ */ jsx(SubcategoryForm, {
					initial: editing,
					categories: categories ?? [],
					onSave: (item) => save.mutate(item),
					pending: save.isPending
				})]
			})]
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "rounded-xl border bg-card shadow-card",
		children: isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
		}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableHead, { children: "Image" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Name" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
			/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
			/* @__PURE__ */ jsx(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ jsx(TableBody, { children: subcategories?.map((item) => /* @__PURE__ */ jsxs(TableRow, { children: [
			/* @__PURE__ */ jsx(TableCell, { children: item.image_url ? /* @__PURE__ */ jsx("img", {
				src: item.image_url,
				alt: item.name,
				className: "h-10 w-10 rounded object-cover"
			}) : /* @__PURE__ */ jsx(Tag, { className: "h-8 w-8 text-muted-foreground" }) }),
			/* @__PURE__ */ jsx(TableCell, {
				className: "font-medium",
				children: item.name
			}),
			/* @__PURE__ */ jsx(TableCell, { children: item.categories?.name ?? item.category_name ?? "—" }),
			/* @__PURE__ */ jsx(TableCell, { children: item.is_active ? /* @__PURE__ */ jsx(Badge, {
				className: "bg-success text-success-foreground",
				children: "Active"
			}) : /* @__PURE__ */ jsx(Badge, {
				variant: "secondary",
				children: "Hidden"
			}) }),
			/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-end gap-1",
				children: [/* @__PURE__ */ jsx(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					title: item.is_active ? "Hide" : "Show",
					onClick: () => toggle.mutate({
						id: item.id,
						is_active: !item.is_active
					}),
					children: item.is_active ? /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4 text-muted-foreground" })
				}), /* @__PURE__ */ jsx(Button, {
					size: "icon",
					variant: "ghost",
					className: "h-8 w-8",
					onClick: () => {
						setEditing(item);
						setOpen(true);
					},
					children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
				})]
			}) })
		] }, item.id)) })] })
	})] });
}
function SubcategoryForm({ initial, categories, onSave, pending }) {
	const fileInputRef = useRef(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(initial?.image_url ?? null);
	const [imageError, setImageError] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [item, setItem] = useState(initial ?? {
		category_id: categories[0]?.id ?? "",
		category_name: categories[0]?.name ?? "",
		name: "",
		slug: "",
		description: "",
		image_url: "",
		is_active: true
	});
	useEffect(() => {
		setItem(initial ?? {
			category_id: categories[0]?.id ?? "",
			category_name: categories[0]?.name ?? "",
			name: "",
			slug: "",
			description: "",
			image_url: "",
			is_active: true
		});
		setImageFile(null);
		setImagePreview(initial?.image_url ?? null);
		setImageError(null);
	}, [initial?.id, categories]);
	const set = (key, value) => setItem((prev) => ({
		...prev,
		[key]: value
	}));
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			const trimmedName = (item.name || "").trim();
			const trimmedSlug = (item.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "subcategory").trim();
			if (!trimmedName || !item.category_id) {
				toast.error("Please select a category and enter a subcategory name.");
				return;
			}
			try {
				let finalImageUrl = item.image_url || null;
				if (imageFile) {
					setIsUploading(true);
					const selectedCategory = categories.find((c) => c.id === item.category_id);
					finalImageUrl = await uploadImageToBucket(imageFile, "subcategories", selectedCategory?.name || item.name, "subcat");
				}
				onSave({
					...item,
					name: trimmedName,
					slug: trimmedSlug,
					category_name: categories.find((c) => c.id === item.category_id)?.name ?? item.category_name,
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
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Category" }), /* @__PURE__ */ jsxs(Select, {
				value: item.category_id ?? "",
				onValueChange: (value) => {
					const category = categories.find((c) => c.id === value);
					set("category_id", value);
					set("category_name", category?.name ?? "");
				},
				children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select category" }) }), /* @__PURE__ */ jsx(SelectContent, { children: categories.map((category) => /* @__PURE__ */ jsx(SelectItem, {
					value: category.id,
					children: category.name
				}, category.id)) })]
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Subcategory Name *" }), /* @__PURE__ */ jsx(Input, {
					value: item.name ?? "",
					onChange: (e) => {
						set("name", e.target.value);
						if (!initial?.id) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
					},
					placeholder: "Premium Rice"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Slug" }), /* @__PURE__ */ jsx(Input, {
					value: item.slug ?? "",
					onChange: (e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")),
					placeholder: "premium-rice"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Description" }), /* @__PURE__ */ jsx(Input, {
				value: item.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short description"
			})] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Upload Image" }), /* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex items-start gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center",
					children: [imagePreview ? /* @__PURE__ */ jsx("img", {
						src: imagePreview,
						alt: "subcategory preview",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ jsx(Tag, { className: "h-8 w-8 text-muted-foreground/50" }), imagePreview && /* @__PURE__ */ jsx(Button, {
						type: "button",
						size: "icon",
						variant: "destructive",
						className: "absolute right-1 top-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100",
						onClick: () => {
							setImageFile(null);
							setImagePreview(null);
							set("image_url", "");
						},
						children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ jsx("input", {
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
						/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "outline",
							className: "mb-2",
							onClick: () => fileInputRef.current?.click(),
							children: imagePreview ? "Replace Image" : "Upload Image"
						}),
						imageError && /* @__PURE__ */ jsx("p", {
							className: "mb-2 text-sm text-destructive",
							children: imageError
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: "JPG, JPEG, PNG, or WEBP. Max size 5MB."
						})
					]
				})]
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 rounded-lg border bg-muted/50 p-3",
				children: [/* @__PURE__ */ jsx("input", {
					type: "checkbox",
					checked: item.is_active !== false,
					onChange: (e) => set("is_active", e.target.checked),
					className: "h-4 w-4 rounded"
				}), /* @__PURE__ */ jsx(Label, {
					className: "cursor-pointer",
					children: "Active / Visible"
				})]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "submit",
				disabled: pending || isUploading,
				className: "w-full rounded-full",
				children: [(pending || isUploading) && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Subcategory" : "Create Subcategory"]
			})
		]
	});
}
//#endregion
export { AdminSubcategories as component };

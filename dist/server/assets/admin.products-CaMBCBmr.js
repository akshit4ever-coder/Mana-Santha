import { t as supabase } from "./client-Dxm-ZOZR.js";
import { o as Button } from "./router-DKDYeeFZ.js";
import { t as Input } from "./input-Ceah8uUG.js";
import { t as Label } from "./label-CWAXRbd-.js";
import { a as DialogTrigger, i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-CFVFmvkS.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-ceoVlvxT.js";
import { t as Badge } from "./badge-Dw1JS-RI.js";
import { a as deleteProductImage, c as uploadProductImage, i as compressImageFile, o as moveProductImage, r as PLACEHOLDER_IMAGE, t as ALLOWED_IMAGE_TYPES } from "./product-storage-CLqEGs3S.js";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CcPthqrS.js";
import { n as formatINR } from "./format-S14ZKO36.js";
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Eye, EyeOff, Filter, Loader2, Pencil, Plus, RotateCcw, Search, ShoppingBag, Trash2, X } from "lucide-react";
//#region src/routes/admin.products.tsx?tsr-split=component
var STATUS_CONFIG = {
	active: {
		label: "Active",
		className: "bg-success text-success-foreground"
	},
	inactive: {
		label: "Inactive",
		className: ""
	},
	out_of_stock: {
		label: "Out of Stock",
		className: "bg-accent text-accent-foreground"
	},
	discontinued: {
		label: "Discontinued",
		className: "bg-destructive text-destructive-foreground"
	}
};
function AdminProducts() {
	const qc = useQueryClient();
	const [editing, setEditing] = useState(null);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");
	const { data: products, isLoading } = useQuery({
		queryKey: ["admin-products"],
		queryFn: async () => {
			try {
				const { data, error } = await supabase.from("products").select("*, categories(name, slug), subcategories(name, slug), product_variants(*)").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
				if (error) throw error;
				return data;
			} catch (err) {
				const msg = err?.message ?? String(err);
				if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
					const { data, error } = await supabase.from("products").select("*, categories(name, slug), subcategories(name, slug)").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
					if (error) throw error;
					return data;
				}
				throw err;
			}
		}
	});
	const { data: categories } = useQuery({
		queryKey: ["admin-categories"],
		queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data
	});
	const save = useMutation({
		mutationFn: async (p) => {
			const normalizedName = (p.name || "").trim();
			const payload = {
				name: normalizedName,
				slug: (p.slug || normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product").trim(),
				brand: p.brand || null,
				description: p.description || null,
				image_url: p.image_url || null,
				mrp: Number(p.mrp ?? 0),
				price: Number(p.price ?? 0),
				unit: p.unit,
				weight: p.weight || null,
				stock: Number(p.stock ?? 0),
				max_qty: Number(p.max_qty) || 20,
				category_id: p.category_id || null,
				category_name: p.category_name || null,
				subcategory_id: p.subcategory_id || null,
				subcategory_name: p.subcategory_name || null,
				sort_order: Number(p.sort_order ?? 999) || 999,
				is_featured: !!p.is_featured,
				is_active: p.is_active !== false,
				status: p.status || "active",
				sku: p.sku || null
			};
			let productId = p.id;
			if (p.id) {
				const { error } = await supabase.from("products").update(payload).eq("id", p.id);
				if (error) throw error;
			} else {
				const { data: inserted, error } = await supabase.from("products").insert(payload).select().single();
				if (error) throw error;
				productId = inserted.id;
			}
			if (Array.isArray(p.product_variants)) {
				const { error: delErr } = await supabase.from("product_variants").delete().eq("product_id", productId);
				if (delErr) throw delErr;
				const variantsToInsert = p.product_variants.map((v, idx) => ({
					product_id: productId,
					option_name: p.variant_option_name || v.option_name || "Size",
					name: v.name,
					quantity_value: v.quantity_value ?? null,
					unit: v.unit ?? null,
					sku: v.sku ?? null,
					barcode: v.barcode ?? null,
					mrp: Number(v.mrp ?? 0),
					selling_price: Number(v.selling_price ?? v.price ?? 0),
					stock: Number(v.stock ?? 0),
					max_qty: Number(v.max_qty ?? p.max_qty ?? 20),
					sort_order: Number(v.sort_order ?? idx),
					image_url: v.image_url ?? null,
					is_default: !!v.is_default,
					is_active: v.is_active !== false
				}));
				if (variantsToInsert.length > 0) {
					const { error: insErr } = await supabase.from("product_variants").insert(variantsToInsert);
					if (insErr) throw insErr;
				}
				const defaultVariant = variantsToInsert.find((v) => v.is_default) || variantsToInsert[0];
				if (defaultVariant) {
					const upd = {
						mrp: defaultVariant.mrp,
						price: defaultVariant.selling_price,
						stock: defaultVariant.stock
					};
					const { error: upErr } = await supabase.from("products").update(upd).eq("id", productId);
					if (upErr) throw upErr;
				}
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product saved successfully");
			setOpen(false);
			setEditing(null);
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteProduct = useMutation({
		mutationFn: async (product) => {
			if (product.image_url) await deleteProductImage(product.image_url);
			const { error } = await supabase.from("products").delete().eq("id", product.id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product deleted successfully");
		},
		onError: (e) => toast.error(e.message)
	});
	const softDelete = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").update({
				is_active: false,
				status: "discontinued"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success("Product hidden (soft deleted). Use Restore to undo.");
		},
		onError: (e) => toast.error(e.message)
	});
	const restore = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").update({
				is_active: true,
				status: "active"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Product restored");
		}
	});
	const toggleVisible = useMutation({
		mutationFn: async ({ id, is_active }) => {
			const { error } = await supabase.from("products").update({
				is_active,
				status: is_active ? "active" : "inactive"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
		}
	});
	const markOutOfStock = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").update({
				stock: 0,
				status: "out_of_stock"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			toast.success("Product marked as Out of Stock");
		}
	});
	const setStatus = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("products").update({
				status,
				is_active: status === "active"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-products"] });
			qc.invalidateQueries({ queryKey: ["products"] });
			toast.success("Status updated");
		}
	});
	const filtered = (products ?? []).filter((p) => {
		const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
		const matchStatus = filterStatus === "all" || p.status === filterStatus || !p.status && filterStatus === "active";
		return matchSearch && matchStatus;
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-2xl font-bold md:text-3xl",
				children: "Products"
			}), /* @__PURE__ */ jsxs("p", {
				className: "text-sm text-muted-foreground",
				children: [products?.length ?? 0, " products total"]
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
						children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), "New Product"]
					})
				}), /* @__PURE__ */ jsxs(DialogContent, {
					className: "max-h-[90vh] overflow-y-auto sm:max-w-lg",
					children: [/* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [editing?.id ? "Edit" : "New", " Product"] }) }), /* @__PURE__ */ jsx(ProductForm, {
						categories: categories ?? [],
						initial: editing,
						onSave: (p) => save.mutate(p),
						pending: save.isPending
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative flex-1 min-w-[200px]",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
					placeholder: "Search by name, brand, SKU...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9"
				})]
			}), /* @__PURE__ */ jsxs(Select, {
				value: filterStatus,
				onValueChange: setFilterStatus,
				children: [/* @__PURE__ */ jsxs(SelectTrigger, {
					className: "w-40",
					children: [/* @__PURE__ */ jsx(Filter, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ jsx(SelectValue, {})]
				}), /* @__PURE__ */ jsxs(SelectContent, { children: [
					/* @__PURE__ */ jsx(SelectItem, {
						value: "all",
						children: "All Status"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "active",
						children: "Active"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "inactive",
						children: "Inactive"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "out_of_stock",
						children: "Out of Stock"
					}),
					/* @__PURE__ */ jsx(SelectItem, {
						value: "discontinued",
						children: "Discontinued"
					})
				] })]
			})]
		}),
		/* @__PURE__ */ jsx("div", {
			className: "rounded-xl border bg-card shadow-card overflow-x-auto",
			children: isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" })
			}) : /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
				/* @__PURE__ */ jsx(TableHead, { children: "Product" }),
				/* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Category" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Price" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
				/* @__PURE__ */ jsx(TableHead, { children: "Status" }),
				/* @__PURE__ */ jsx(TableHead, {
					className: "text-right",
					children: "Actions"
				})
			] }) }), /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
				colSpan: 7,
				className: "py-12 text-center text-muted-foreground",
				children: "No products found"
			}) }) : filtered.map((p) => {
				const status = p.status || "active";
				STATUS_CONFIG[status] ?? STATUS_CONFIG["active"];
				return /* @__PURE__ */ jsxs(TableRow, {
					className: !p.is_active ? "opacity-60" : "",
					children: [
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("img", {
								src: p.image_url || "/assets/images/product-placeholder.png",
								alt: p.name,
								loading: "lazy",
								decoding: "async",
								className: "h-10 w-10 rounded-lg object-cover",
								onError: (e) => {
									e.currentTarget.src = PLACEHOLDER_IMAGE;
								}
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "font-medium",
								children: p.name
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [
									p.brand,
									" ",
									p.product_variants?.length ? `· ${p.product_variants.length} variants` : ""
								]
							})] })]
						}) }),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-xs text-muted-foreground font-mono",
							children: p.sku || "—"
						}),
						/* @__PURE__ */ jsx(TableCell, {
							className: "text-sm",
							children: p.categories?.name ?? "—"
						}),
						/* @__PURE__ */ jsx(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? (() => {
							const active = p.product_variants.filter((v) => v.is_active !== false);
							const starting = Math.min(...active.map((v) => Number(v.selling_price ?? v.price ?? 0)));
							return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
								className: "font-medium",
								children: ["Starting ", formatINR(starting)]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-xs text-muted-foreground",
								children: [p.product_variants.length, " variants"]
							})] });
						})() : /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
							className: "font-medium",
							children: formatINR(p.price)
						}), p.mrp > p.price && /* @__PURE__ */ jsx("div", {
							className: "text-xs text-muted-foreground line-through",
							children: formatINR(p.mrp)
						})] }) }),
						/* @__PURE__ */ jsx(TableCell, { children: p.product_variants && p.product_variants.length > 0 ? /* @__PURE__ */ jsxs("span", {
							className: "text-sm",
							children: [p.product_variants.reduce((s, v) => s + Number(v.stock || 0), 0), " total"]
						}) : p.stock <= 0 ? /* @__PURE__ */ jsx(Badge, {
							variant: "destructive",
							children: "Out of stock"
						}) : p.stock < 10 ? /* @__PURE__ */ jsxs(Badge, {
							className: "bg-amber-100 text-amber-800",
							children: [
								/* @__PURE__ */ jsx(AlertTriangle, { className: "mr-1 h-3 w-3" }),
								p.stock,
								" left"
							]
						}) : /* @__PURE__ */ jsx("span", {
							className: "text-sm",
							children: p.stock
						}) }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(Select, {
							value: status,
							onValueChange: (v) => setStatus.mutate({
								id: p.id,
								status: v
							}),
							children: [/* @__PURE__ */ jsx(SelectTrigger, {
								className: "h-7 w-36 text-xs",
								children: /* @__PURE__ */ jsx(SelectValue, {})
							}), /* @__PURE__ */ jsxs(SelectContent, { children: [
								/* @__PURE__ */ jsx(SelectItem, {
									value: "active",
									children: "✅ Active"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "inactive",
									children: "🔕 Inactive"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "out_of_stock",
									children: "📦 Out of Stock"
								}),
								/* @__PURE__ */ jsx(SelectItem, {
									value: "discontinued",
									children: "🚫 Discontinued"
								})
							] })]
						}) }),
						/* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-end gap-1",
							children: [
								status !== "out_of_stock" && p.is_active && /* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: "Mark as Out of Stock",
									className: "h-8 w-8",
									onClick: () => markOutOfStock.mutate(p.id),
									children: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-4 w-4 text-amber-500" })
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: p.is_active ? "Hide from store" : "Show in store",
									className: "h-8 w-8",
									onClick: () => toggleVisible.mutate({
										id: p.id,
										is_active: !p.is_active
									}),
									children: p.is_active ? /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4 text-muted-foreground" })
								}),
								/* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: "Edit product",
									className: "h-8 w-8",
									onClick: () => {
										setEditing(p);
										setOpen(true);
									},
									children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" })
								}),
								status === "discontinued" ? /* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: "Restore product",
									className: "h-8 w-8 text-success",
									onClick: () => restore.mutate(p.id),
									children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" })
								}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: "Soft delete (discontinue) product",
									className: "h-8 w-8 text-destructive hover:text-destructive",
									onClick: () => {
										if (confirm(`Discontinue "${p.name}"? It will be hidden from customers. You can restore it later.`)) softDelete.mutate(p.id);
									},
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								}), /* @__PURE__ */ jsx(Button, {
									size: "icon",
									variant: "ghost",
									title: "Delete product permanently",
									className: "h-8 w-8 text-destructive hover:text-destructive",
									onClick: () => {
										if (confirm(`Delete "${p.name}" permanently? This will remove the product and its image.`)) deleteProduct.mutate(p);
									},
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								})] })
							]
						}) })
					]
				}, p.id);
			}) })] })
		})
	] });
}
function ProductForm({ initial, categories, onSave, pending }) {
	const fileInputRef = useRef(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(initial?.image_url ?? null);
	const [imageError, setImageError] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [p, setP] = useState(initial ?? {
		name: "",
		slug: "",
		sku: "",
		brand: "",
		price: 0,
		mrp: 0,
		unit: "piece",
		weight: "",
		stock: 0,
		max_qty: 20,
		image_url: "",
		variant_option_name: "Size",
		product_variants: [],
		description: "",
		category_id: categories[0]?.id ?? "",
		category_name: categories[0]?.name ?? "",
		subcategory_id: "",
		subcategory_name: "",
		sort_order: 999,
		is_featured: false,
		is_active: true,
		status: "active"
	});
	const { data: subcategories = [] } = useQuery({
		queryKey: ["subcategories-by-category", p.category_id],
		queryFn: async () => {
			if (!p.category_id) return [];
			const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", p.category_id).eq("is_active", true).order("name");
			if (error) throw error;
			return data ?? [];
		},
		enabled: !!p.category_id
	});
	useEffect(() => {
		setP(initial ?? {
			name: "",
			slug: "",
			sku: "",
			brand: "",
			price: 0,
			mrp: 0,
			unit: "piece",
			weight: "",
			stock: 0,
			max_qty: 20,
			image_url: "",
			variant_option_name: "Size",
			product_variants: [],
			description: "",
			category_id: categories[0]?.id ?? "",
			category_name: categories[0]?.name ?? "",
			subcategory_id: "",
			subcategory_name: "",
			sort_order: 999,
			is_featured: false,
			is_active: true,
			status: "active"
		});
		setImageFile(null);
		setImagePreview(initial?.image_url ?? null);
		setImageError(null);
	}, [initial?.id, categories]);
	const set = (k, v) => setP((prev) => ({
		...prev,
		[k]: v
	}));
	const [variantFiles, setVariantFiles] = useState({});
	useEffect(() => {
		if (initial?.product_variants) setP((prev) => ({
			...prev,
			product_variants: initial.product_variants
		}));
	}, [initial?.product_variants]);
	const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: async (e) => {
			e.preventDefault();
			const trimmedName = (p.name || "").trim();
			const trimmedSlug = (p.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product").trim();
			if (!trimmedName || !trimmedSlug) {
				toast.error("Please complete the required product details before saving.");
				return;
			}
			try {
				let finalImageUrl = p.image_url || null;
				const previousImageUrl = initial?.image_url || null;
				const isImageRemoved = !imageFile && !imagePreview && !!previousImageUrl && !p.image_url;
				if (imageFile) {
					setIsUploading(true);
					const compressedFile = await compressImageFile(imageFile);
					finalImageUrl = await uploadProductImage(compressedFile, trimmedName);
					if (previousImageUrl && previousImageUrl !== finalImageUrl) try {
						await deleteProductImage(previousImageUrl);
					} catch (deleteError) {
						console.error("Failed to delete previous product image", deleteError);
					}
				} else if (isImageRemoved) {
					await deleteProductImage(previousImageUrl);
					finalImageUrl = null;
				} else if (previousImageUrl && initial?.name && initial.name !== trimmedName) {
					const movedUrl = await moveProductImage(previousImageUrl, trimmedName);
					if (movedUrl) finalImageUrl = movedUrl;
				}
				const variants = [...p.product_variants ?? []];
				for (let i = 0; i < variants.length; i++) {
					const file = variantFiles[i];
					if (file) {
						const compressed = await compressImageFile(file);
						const url = await uploadProductImage(compressed, `${trimmedName}-${variants[i].name || i}`);
						variants[i].image_url = url;
					}
				}
				onSave({
					...p,
					name: trimmedName,
					slug: trimmedSlug,
					image_url: finalImageUrl,
					product_variants: variants,
					variant_option_name: p.variant_option_name || "Size",
					category_name: categories.find((c) => c.id === p.category_id)?.name ?? p.category_name ?? null,
					subcategory_name: subcategories.find((s) => s.id === p.subcategory_id)?.name ?? p.subcategory_name ?? null,
					sort_order: Number(p.sort_order ?? 999) || 999
				});
			} catch (error) {
				toast.error(error?.message || "Failed to upload image");
			} finally {
				setIsUploading(false);
			}
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Name *" }), /* @__PURE__ */ jsx(Input, {
					required: true,
					value: p.name,
					onChange: (e) => {
						set("name", e.target.value);
						if (!initial?.id) set("slug", autoSlug(e.target.value));
					},
					placeholder: "Product name"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Slug *" }), /* @__PURE__ */ jsx(Input, {
					required: true,
					value: p.slug,
					onChange: (e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")),
					placeholder: "product-slug"
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Brand" }), /* @__PURE__ */ jsx(Input, {
						value: p.brand ?? "",
						onChange: (e) => set("brand", e.target.value),
						placeholder: "Brand name"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "SKU" }), /* @__PURE__ */ jsx(Input, {
						value: p.sku ?? "",
						onChange: (e) => set("sku", e.target.value.toUpperCase()),
						placeholder: "MS-001"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Category" }), /* @__PURE__ */ jsxs(Select, {
						value: p.category_id ?? "",
						onValueChange: (v) => {
							const category = categories.find((c) => c.id === v);
							set("category_id", v);
							set("category_name", category?.name ?? "");
							set("subcategory_id", "");
							set("subcategory_name", "");
						},
						children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select" }) }), /* @__PURE__ */ jsx(SelectContent, { children: categories.map((c) => /* @__PURE__ */ jsx(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id)) })]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Subcategory" }), /* @__PURE__ */ jsxs(Select, {
					value: p.subcategory_id ?? "",
					onValueChange: (v) => {
						const subcategory = subcategories.find((s) => s.id === v);
						set("subcategory_id", v);
						set("subcategory_name", subcategory?.name ?? "");
					},
					disabled: !p.category_id || subcategories.length === 0,
					children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: p.category_id ? "Select Subcategory" : "Select a category first" }) }), /* @__PURE__ */ jsx(SelectContent, { children: subcategories.map((s) => /* @__PURE__ */ jsx(SelectItem, {
						value: s.id,
						children: s.name
					}, s.id)) })]
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Sort Order" }), /* @__PURE__ */ jsx(Input, {
					type: "number",
					min: "1",
					value: p.sort_order ?? 999,
					onChange: (e) => set("sort_order", e.target.value)
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "MRP (₹) *" }), /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						step: "0.01",
						required: true,
						value: p.mrp,
						onChange: (e) => set("mrp", e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Selling Price (₹) *" }), /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						step: "0.01",
						required: true,
						value: p.price,
						onChange: (e) => set("price", e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Status" }), /* @__PURE__ */ jsxs(Select, {
						value: p.status ?? "active",
						onValueChange: (v) => set("status", v),
						children: [/* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }), /* @__PURE__ */ jsxs(SelectContent, { children: [
							/* @__PURE__ */ jsx(SelectItem, {
								value: "active",
								children: "✅ Active"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "inactive",
								children: "🔕 Inactive"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "out_of_stock",
								children: "📦 Out of Stock"
							}),
							/* @__PURE__ */ jsx(SelectItem, {
								value: "discontinued",
								children: "🚫 Discontinued"
							})
						] })]
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Unit" }), /* @__PURE__ */ jsx(Input, {
						value: p.unit,
						onChange: (e) => set("unit", e.target.value),
						placeholder: "kg / piece / L"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Weight" }), /* @__PURE__ */ jsx(Input, {
						value: p.weight ?? "",
						onChange: (e) => set("weight", e.target.value),
						placeholder: "1 kg / 500 g"
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Stock" }), /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "0",
						value: p.stock,
						onChange: (e) => set("stock", e.target.value)
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Max Qty" }), /* @__PURE__ */ jsx(Input, {
						type: "number",
						min: "1",
						value: p.max_qty,
						onChange: (e) => set("max_qty", e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Upload Product Image" }), /* @__PURE__ */ jsxs("div", {
				className: "mt-2 flex items-start gap-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center",
					children: [imagePreview ? /* @__PURE__ */ jsx("img", {
						src: imagePreview,
						alt: "product preview",
						loading: "lazy",
						decoding: "async",
						className: "h-full w-full object-cover",
						onError: (e) => {
							e.currentTarget.src = PLACEHOLDER_IMAGE;
						}
					}) : /* @__PURE__ */ jsx(ShoppingBag, { className: "h-8 w-8 text-muted-foreground/50" }), imagePreview && /* @__PURE__ */ jsx(Button, {
						type: "button",
						size: "icon",
						variant: "destructive",
						className: "absolute right-1 top-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100",
						onClick: () => {
							setImageFile(null);
							setImagePreview(null);
							setImageError(null);
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
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(Label, { children: "Description" }), /* @__PURE__ */ jsx(Input, {
				value: p.description ?? "",
				onChange: (e) => set("description", e.target.value),
				placeholder: "Short product description"
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-lg border bg-card p-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "font-medium",
						children: "Variants"
					}), /* @__PURE__ */ jsx("div", {
						className: "text-xs text-muted-foreground",
						children: "Manage pack sizes, prices and stock per variant"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Input, {
							value: p.variant_option_name ?? "Size",
							onChange: (e) => set("variant_option_name", e.target.value),
							className: "w-40"
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							onClick: () => {
								setP((prev) => ({
									...prev,
									product_variants: [...prev.product_variants ?? [], {
										name: "",
										mrp: prev.mrp ?? 0,
										selling_price: prev.price ?? 0,
										sku: "",
										stock: 0,
										max_qty: prev.max_qty ?? 20,
										sort_order: (prev.product_variants ?? []).length,
										image_url: null,
										is_default: (prev.product_variants ?? []).length === 0,
										is_active: true
									}]
								}));
							},
							children: "Add Variant"
						})]
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 space-y-3",
					children: (p.product_variants ?? []).map((v, idx) => /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-12 gap-3 items-start rounded-md border bg-muted/40 p-3",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "col-span-12 grid grid-cols-12 gap-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-4",
									children: [/* @__PURE__ */ jsx(Label, { children: "Variant Name" }), /* @__PURE__ */ jsx(Input, {
										value: v.name ?? "",
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												name: e.target.value
											} : it)
										}))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-3",
									children: [/* @__PURE__ */ jsx(Label, { children: "MRP" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: v.mrp ?? 0,
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												mrp: e.target.value
											} : it)
										}))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-3",
									children: [/* @__PURE__ */ jsx(Label, { children: "Selling" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: v.selling_price ?? v.price ?? 0,
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												selling_price: e.target.value
											} : it)
										}))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-3",
									children: [/* @__PURE__ */ jsx(Label, { children: "Stock" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: v.stock ?? 0,
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												stock: e.target.value
											} : it)
										}))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-3",
									children: [/* @__PURE__ */ jsx(Label, { children: "Max" }), /* @__PURE__ */ jsx(Input, {
										type: "number",
										value: v.max_qty ?? 1,
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												max_qty: e.target.value
											} : it)
										}))
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-2 flex flex-col items-center gap-2",
									children: [/* @__PURE__ */ jsx(Label, { children: "Active" }), /* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: v.is_active !== false,
										onChange: (e) => setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												is_active: e.target.checked
											} : it)
										}))
									})]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "col-span-12",
							children: [/* @__PURE__ */ jsx(Label, { children: "Image" }), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "h-14 w-14 overflow-hidden rounded bg-muted",
									children: /* @__PURE__ */ jsx("img", {
										src: v.image_url || "/assets/images/product-placeholder.png",
										className: "h-full w-full object-cover",
										onError: (e) => {
											e.currentTarget.src = PLACEHOLDER_IMAGE;
										}
									})
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									onChange: (e) => {
										const file = e.target.files?.[0];
										setVariantFiles((prev) => ({
											...prev,
											[idx]: file ?? null
										}));
										if (file) setP((prev) => ({
											...prev,
											product_variants: (prev.product_variants ?? []).map((it, i) => i === idx ? {
												...it,
												image_url: URL.createObjectURL(file)
											} : it)
										}));
									}
								}), /* @__PURE__ */ jsx("div", {
									className: "flex gap-2 mt-2",
									children: /* @__PURE__ */ jsx(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => {
											setP((prev) => ({
												...prev,
												product_variants: (prev.product_variants ?? []).filter((_, i) => i !== idx)
											}));
											setVariantFiles((prev) => {
												const copy = { ...prev };
												delete copy[idx];
												return copy;
											});
										},
										children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
									})
								})] })]
							})]
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-6 rounded-lg border bg-muted/50 p-3",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-sm cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: p.is_featured,
						onChange: (e) => set("is_featured", e.target.checked),
						className: "h-4 w-4 rounded"
					}), "Featured product"]
				}), /* @__PURE__ */ jsxs("label", {
					className: "flex items-center gap-2 text-sm cursor-pointer",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						checked: p.is_active !== false,
						onChange: (e) => set("is_active", e.target.checked),
						className: "h-4 w-4 rounded"
					}), "Visible in store"]
				})]
			}),
			/* @__PURE__ */ jsxs(Button, {
				type: "submit",
				disabled: pending || isUploading,
				className: "w-full rounded-full",
				children: [(pending || isUploading) && /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), initial?.id ? "Update Product" : "Create Product"]
			})
		]
	});
}
//#endregion
export { AdminProducts as component };

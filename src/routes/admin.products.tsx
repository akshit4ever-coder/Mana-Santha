import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/UI/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import { Badge } from "@/components/UI/badge";
import { formatINR } from "@/lib/format";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  PLACEHOLDER_IMAGE,
  compressImageFile,
  deleteProductImage,
  moveProductImage,
  uploadProductImage,
} from "@/lib/product-storage";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ShoppingBag,
  RotateCcw,
  Filter,
  Search,
  AlertTriangle,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type ProductStatus = "active" | "inactive" | "out_of_stock" | "discontinued";

const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; className: string }
> = {
  active: { label: "Active", className: "bg-success text-success-foreground" },
  inactive: { label: "Inactive", className: "" },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-accent text-accent-foreground",
  },
  discontinued: {
    label: "Discontinued",
    className: "bg-destructive text-destructive-foreground",
  },
};

function AdminProducts() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*, categories(name, slug), subcategories(name, slug), product_variants(*)")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
      } catch (err: any) {
        const msg = err?.message ?? String(err);
        if (typeof msg === "string" && (msg.includes("product_variants") || msg.includes("Could not find") || msg.includes("relation \"product_variants\""))) {
          // fallback to querying products without variants (migration not applied yet)
          const { data, error } = await supabase
            .from("products")
            .select("*, categories(name, slug), subcategories(name, slug)")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });
          if (error) throw error;
          return data;
        }
        throw err;
      }
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("*").order("sort_order")).data,
  });

  const save = useMutation({
    mutationFn: async (p: any) => {
      const normalizedName = (p.name || "").trim();
      const normalizedSlug = (p.slug || normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product").trim();
      const payload = {
        name: normalizedName,
        slug: normalizedSlug,
        brand: p.brand || null,
        description: p.description || null,
        image_url: p.image_url || null,
        // keep product-level mrp/price for backward compatibility; prefer variants
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
        sku: p.sku || null,
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

      // Handle variants if provided
      if (Array.isArray(p.product_variants)) {
        // remove existing variants and insert new ones
        const { error: delErr } = await supabase.from("product_variants").delete().eq("product_id", productId);
        if (delErr) throw delErr;

        const variantsToInsert = p.product_variants.map((v: any, idx: number) => ({
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
          is_active: v.is_active !== false,
        }));

        if (variantsToInsert.length > 0) {
          const { error: insErr } = await supabase.from("product_variants").insert(variantsToInsert);
          if (insErr) throw insErr;
        }

        // Update product-level price/mrp/stock to reflect default variant (if any)
        const defaultVariant = variantsToInsert.find((v) => v.is_default) || variantsToInsert[0];
        if (defaultVariant) {
          const upd = {
            mrp: defaultVariant.mrp,
            price: defaultVariant.selling_price,
            stock: defaultVariant.stock,
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
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteProduct = useMutation({
    mutationFn: async (product: any) => {
      if (product.image_url) {
        await deleteProductImage(product.image_url);
      }
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Soft delete: set is_active = false and status = 'discontinued'
  const softDelete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_active: false, status: "discontinued" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product hidden (soft deleted). Use Restore to undo.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // Restore a hidden product
  const restore = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_active: true, status: "active" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product restored");
    },
  });

  // Toggle visibility (is_active)
  const toggleVisible = useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => {
      const { error } = await supabase
        .from("products")
        .update({
          is_active,
          status: is_active ? "active" : "inactive",
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // Mark out of stock
  const markOutOfStock = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .update({ stock: 0, status: "out_of_stock" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product marked as Out of Stock");
    },
  });

  // Set product status
  const setStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ProductStatus;
    }) => {
      const { error } = await supabase
        .from("products")
        .update({
          status,
          is_active: status === "active",
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Status updated");
    },
  });

  const filtered = (products ?? []).filter((p: any) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" || p.status === filterStatus || (!p.status && filterStatus === "active");
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products?.length ?? 0} products total
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setEditing(null);
          }}
        >
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" />
              New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Edit" : "New"} Product
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              categories={categories ?? []}
              initial={editing}
              onSave={(p: any) => save.mutate(p)}
              pending={save.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card shadow-card overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p: any) => {
                  const status: ProductStatus = p.status || "active";
                  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG["active"];
                  return (
                    <TableRow key={p.id} className={!p.is_active ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image_url || PLACEHOLDER_IMAGE}
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e: any) => {
                              e.currentTarget.src = PLACEHOLDER_IMAGE;
                            }}
                          />
                          <div>
                            <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {p.brand} {p.product_variants?.length ? `· ${p.product_variants.length} variants` : ""}
                              </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {p.sku || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.categories?.name ?? "—"}
                      </TableCell>
                      <TableCell>
                        {p.product_variants && p.product_variants.length > 0 ? (
                          (() => {
                            const active = p.product_variants.filter((v: any) => v.is_active !== false);
                            const starting = Math.min(...active.map((v: any) => Number(v.selling_price ?? v.price ?? 0)));
                            return (
                              <div>
                                <div className="font-medium">Starting {formatINR(starting)}</div>
                                <div className="text-xs text-muted-foreground">{p.product_variants.length} variants</div>
                              </div>
                            );
                          })()
                        ) : (
                          <div>
                            <div className="font-medium">{formatINR(p.price)}</div>
                            {p.mrp > p.price && (
                              <div className="text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {p.product_variants && p.product_variants.length > 0 ? (
                          <span className="text-sm">{p.product_variants.reduce((s: number, v: any) => s + Number(v.stock || 0), 0)} total</span>
                        ) : (
                          p.stock <= 0 ? (
                            <Badge variant="destructive">Out of stock</Badge>
                          ) : p.stock < 10 ? (
                            <Badge className="bg-amber-100 text-amber-800">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              {p.stock} left
                            </Badge>
                          ) : (
                            <span className="text-sm">{p.stock}</span>
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={status}
                          onValueChange={(v) =>
                            setStatus.mutate({
                              id: p.id,
                              status: v as ProductStatus,
                            })
                          }
                        >
                          <SelectTrigger className="h-7 w-36 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">✅ Active</SelectItem>
                            <SelectItem value="inactive">🔕 Inactive</SelectItem>
                            <SelectItem value="out_of_stock">📦 Out of Stock</SelectItem>
                            <SelectItem value="discontinued">🚫 Discontinued</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {/* Out of Stock quick button */}
                          {status !== "out_of_stock" && p.is_active && (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Mark as Out of Stock"
                              className="h-8 w-8"
                              onClick={() => markOutOfStock.mutate(p.id)}
                            >
                              <ShoppingBag className="h-4 w-4 text-amber-500" />
                            </Button>
                          )}
                          {/* Show/Hide */}
                          <Button
                            size="icon"
                            variant="ghost"
                            title={p.is_active ? "Hide from store" : "Show in store"}
                            className="h-8 w-8"
                            onClick={() =>
                              toggleVisible.mutate({
                                id: p.id,
                                is_active: !p.is_active,
                              })
                            }
                          >
                            {p.is_active ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                          {/* Edit */}
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit product"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditing(p);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {/* Delete / Restore */}
                          {status === "discontinued" ? (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Restore product"
                              className="h-8 w-8 text-success"
                              onClick={() => restore.mutate(p.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Soft delete (discontinue) product"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Discontinue "${p.name}"? It will be hidden from customers. You can restore it later.`
                                    )
                                  )
                                    softDelete.mutate(p.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                title="Delete product permanently"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm(`Delete "${p.name}" permanently? This will remove the product and its image.`)) {
                                    deleteProduct.mutate(p);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  initial,
  categories,
  onSave,
  pending,
}: {
  initial: any;
  categories: any[];
  onSave: (p: any) => void;
  pending: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [p, setP] = useState<any>(
    initial ?? {
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
      status: "active",
    }
  );

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories-by-category", p.category_id],
    queryFn: async () => {
      if (!p.category_id) return [];
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", p.category_id)
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!p.category_id,
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
      status: "active",
    });
    setImageFile(null);
    setImagePreview(initial?.image_url ?? null);
    setImageError(null);
  }, [initial?.id, categories]);
  const set = (k: string, v: any) => setP((prev: any) => ({ ...prev, [k]: v }));

  // Variant image files: map by index
  const [variantFiles, setVariantFiles] = useState<Record<number, File | null>>({});

  useEffect(() => {
    // initialize product_variants from initial if present
    if (initial?.product_variants) {
      setP((prev: any) => ({ ...prev, product_variants: initial.product_variants }));
    }
  }, [initial?.product_variants]);

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const trimmedName = (p.name || "").trim();
        const trimmedSlug = (p.slug || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product").trim();

        if (!trimmedName || !trimmedSlug) {
          toast.error("Please complete the required product details before saving.");
          return;
        }

        try {
          let finalImageUrl: string | null = p.image_url || null;
          const previousImageUrl = initial?.image_url || null;
          const isImageRemoved = !imageFile && !imagePreview && !!previousImageUrl && !p.image_url;

          if (imageFile) {
            setIsUploading(true);
            const compressedFile = await compressImageFile(imageFile);
            finalImageUrl = await uploadProductImage(compressedFile, trimmedName);

            if (previousImageUrl && previousImageUrl !== finalImageUrl) {
              try {
                await deleteProductImage(previousImageUrl);
              } catch (deleteError) {
                console.error("Failed to delete previous product image", deleteError);
              }
            }
          } else if (isImageRemoved) {
            await deleteProductImage(previousImageUrl);
            finalImageUrl = null;
          } else if (previousImageUrl && initial?.name && initial.name !== trimmedName) {
            const movedUrl = await moveProductImage(previousImageUrl, trimmedName);
            if (movedUrl) finalImageUrl = movedUrl;
          }

          // upload variant images if any
          const variants = [...(p.product_variants ?? [])];
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
            category_name: categories.find((c: any) => c.id === p.category_id)?.name ?? p.category_name ?? null,
            subcategory_name: subcategories.find((s: any) => s.id === p.subcategory_id)?.name ?? p.subcategory_name ?? null,
            sort_order: Number(p.sort_order ?? 999) || 999,
          });
        } catch (error: any) {
          toast.error(error?.message || "Failed to upload image");
        } finally {
          setIsUploading(false);
        }
      }}
      className="space-y-4"
    >
      {/* Name & Slug */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Name *</Label>
          <Input
            required
            value={p.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!initial?.id) set("slug", autoSlug(e.target.value));
            }}
            placeholder="Product name"
          />
        </div>
        <div>
          <Label>Slug *</Label>
          <Input
            required
            value={p.slug}
            onChange={(e) =>
              set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            placeholder="product-slug"
          />
        </div>
      </div>

      {/* Brand, SKU & Category */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Brand</Label>
          <Input
            value={p.brand ?? ""}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="Brand name"
          />
        </div>
        <div>
          <Label>SKU</Label>
          <Input
            value={p.sku ?? ""}
            onChange={(e) => set("sku", e.target.value.toUpperCase())}
            placeholder="MS-001"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select
            value={p.category_id ?? ""}
            onValueChange={(v) => {
              const category = categories.find((c: any) => c.id === v);
              set("category_id", v);
              set("category_name", category?.name ?? "");
              set("subcategory_id", "");
              set("subcategory_name", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Subcategory</Label>
          <Select
            value={p.subcategory_id ?? ""}
            onValueChange={(v) => {
              const subcategory = subcategories.find((s: any) => s.id === v);
              set("subcategory_id", v);
              set("subcategory_name", subcategory?.name ?? "");
            }}
            disabled={!p.category_id || subcategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={p.category_id ? "Select Subcategory" : "Select a category first"} />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((s: any) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input
            type="number"
            min="1"
            value={p.sort_order ?? 999}
            onChange={(e) => set("sort_order", e.target.value)}
          />
        </div>
      </div>

      {/* MRP, Price & Status */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>MRP (₹) *</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            required
            value={p.mrp}
            onChange={(e) => set("mrp", e.target.value)}
          />
        </div>
        <div>
          <Label>Selling Price (₹) *</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            required
            value={p.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={p.status ?? "active"} onValueChange={(v) => set("status", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">✅ Active</SelectItem>
              <SelectItem value="inactive">🔕 Inactive</SelectItem>
              <SelectItem value="out_of_stock">📦 Out of Stock</SelectItem>
              <SelectItem value="discontinued">🚫 Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Unit, Weight, Stock, Max Qty */}
      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label>Unit</Label>
          <Input
            value={p.unit}
            onChange={(e) => set("unit", e.target.value)}
            placeholder="kg / piece / L"
          />
        </div>
        <div>
          <Label>Weight</Label>
          <Input
            value={p.weight ?? ""}
            onChange={(e) => set("weight", e.target.value)}
            placeholder="1 kg / 500 g"
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            min="0"
            value={p.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
        </div>
        <div>
          <Label>Max Qty</Label>
          <Input
            type="number"
            min="1"
            value={p.max_qty}
            onChange={(e) => set("max_qty", e.target.value)}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <Label>Upload Product Image</Label>
        <div className="mt-2 flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="product preview"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                onError={(e: any) => {
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            ) : (
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
            )}
            {imagePreview && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setImageError(null);
                  set("image_url", "");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                  setImageError("Only JPG, JPEG, PNG, and WEBP files are supported.");
                  setImageFile(null);
                  return;
                }

                if (file.size > MAX_IMAGE_SIZE_BYTES) {
                  setImageError("Image must be 5MB or smaller.");
                  setImageFile(null);
                  return;
                }

                setImageError(null);
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
            <Button type="button" variant="outline" className="mb-2" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? "Replace Image" : "Upload Image"}
            </Button>
            {imageError && <p className="mb-2 text-sm text-destructive">{imageError}</p>}
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG, or WEBP. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Input
          value={p.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short product description"
        />
      </div>

      {/* Variants editor */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Variants</div>
            <div className="text-xs text-muted-foreground">Manage pack sizes, prices and stock per variant</div>
          </div>
          <div className="flex items-center gap-2">
            <Input value={p.variant_option_name ?? "Size"} onChange={(e) => set("variant_option_name", e.target.value)} className="w-40" />
            <Button type="button" onClick={() => {
              setP((prev: any) => ({ ...prev, product_variants: [...(prev.product_variants ?? []), { name: "", mrp: prev.mrp ?? 0, selling_price: prev.price ?? 0, sku: "", stock: 0, max_qty: prev.max_qty ?? 20, sort_order: (prev.product_variants ?? []).length, image_url: null, is_default: (prev.product_variants ?? []).length === 0, is_active: true }] }));
            }}>Add Variant</Button>
          </div>
        </div>

        <div className="mt-3 space-y-3">
          {(p.product_variants ?? []).map((v: any, idx: number) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-start rounded-md border bg-muted/40 p-3">
              <div className="col-span-12 grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <Label>Variant Name</Label>
                  <Input value={v.name ?? ""} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, name: e.target.value } : it) }))} />
                </div>
                <div className="col-span-3">
                  <Label>MRP</Label>
                  <Input type="number" value={v.mrp ?? 0} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, mrp: e.target.value } : it) }))} />
                </div>
                <div className="col-span-3">
                  <Label>Selling</Label>
                  <Input type="number" value={v.selling_price ?? v.price ?? 0} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, selling_price: e.target.value } : it) }))} />
                </div>
                <div className="col-span-3">
                  <Label>Stock</Label>
                  <Input type="number" value={v.stock ?? 0} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, stock: e.target.value } : it) }))} />
                </div>
                <div className="col-span-3">
                  <Label>Max</Label>
                  <Input type="number" value={v.max_qty ?? 1} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, max_qty: e.target.value } : it) }))} />
                </div>
                <div className="col-span-2 flex flex-col items-center gap-2">
                  <Label>Active</Label>
                  <input type="checkbox" checked={v.is_active !== false} onChange={(e) => setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, is_active: e.target.checked } : it) }))} />
                </div>
              </div>
              <div className="col-span-12">
                <Label>Image</Label>
                <div className="flex items-center gap-2">
                  <div className="h-14 w-14 overflow-hidden rounded bg-muted">
                    <img src={v.image_url || PLACEHOLDER_IMAGE} className="h-full w-full object-cover" onError={(e:any)=>{e.currentTarget.src=PLACEHOLDER_IMAGE}} />
                  </div>
                  <div>
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
                      const file = e.target.files?.[0];
                      setVariantFiles((prev) => ({ ...prev, [idx]: file ?? null }));
                      // also set preview URL immediately
                      if (file) {
                        setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).map((it: any, i: number) => i === idx ? { ...it, image_url: URL.createObjectURL(file) } : it) }));
                      }
                    }} />
                    <div className="flex gap-2 mt-2">
                      <Button size="icon" variant="ghost" onClick={() => {
                        // remove variant
                        setP((prev: any) => ({ ...prev, product_variants: (prev.product_variants ?? []).filter((_: any, i: number) => i !== idx) }));
                        setVariantFiles((prev) => { const copy = { ...prev }; delete copy[idx]; return copy; });
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6 rounded-lg border bg-muted/50 p-3">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={p.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Featured product
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={p.is_active !== false}
            onChange={(e) => set("is_active", e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Visible in store
        </label>
      </div>

      <Button type="submit" disabled={pending || isUploading} className="w-full rounded-full">
        {(pending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}

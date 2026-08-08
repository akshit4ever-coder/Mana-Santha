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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Eye, EyeOff, Tag, X } from "lucide-react";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  PLACEHOLDER_IMAGE,
  deleteStorageImage,
  uploadImageToBucket,
} from "@/lib/product-storage";

export const Route = createFileRoute("/admin/subcategories")({
  component: AdminSubcategories,
});

function AdminSubcategories() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () =>
      (await supabase.from("categories").select("*").eq("is_active", true).order("sort_order")).data ?? [],
  });

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ["admin-subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subcategories").select("*, categories(name)").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (item: any) => {
      const payload = {
        category_id: item.category_id || null,
        category_name: item.category_name || null,
        name: item.name?.trim(),
        slug: item.slug?.trim() || null,
        description: item.description || null,
        image_url: item.image_url || null,
        is_active: item.is_active !== false,
      };

      if (!payload.category_id) throw new Error("Please select a category");
      if (!payload.name) throw new Error("Please enter a subcategory name");

      const { data: existing, error: lookupError } = await supabase
        .from("subcategories")
        .select("id")
        .eq("category_id", payload.category_id)
        .ilike("name", payload.name)
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing && existing.id !== item.id) {
        throw new Error("A subcategory with this name already exists in that category.");
      }

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
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("subcategories").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subcategories"] });
      qc.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Subcategories</h1>
          <p className="text-sm text-muted-foreground">{subcategories?.length ?? 0} subcategories</p>
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
              New Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit" : "New"} Subcategory</DialogTitle>
            </DialogHeader>
            <SubcategoryForm
              initial={editing}
              categories={categories ?? []}
              onSave={(item: any) => save.mutate(item)}
              pending={save.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcategories?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url ? <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded object-cover" /> : <Tag className="h-8 w-8 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.categories?.name ?? item.category_name ?? "—"}</TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" title={item.is_active ? "Hide" : "Show"} onClick={() => toggle.mutate({ id: item.id, is_active: !item.is_active })}>
                        {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditing(item); setOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function SubcategoryForm({
  initial,
  categories,
  onSave,
  pending,
}: {
  initial: any;
  categories: any[];
  onSave: (item: any) => void;
  pending: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [item, setItem] = useState<any>(
    initial ?? {
      category_id: categories[0]?.id ?? "",
      category_name: categories[0]?.name ?? "",
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
    }
  );

  useEffect(() => {
    setItem(initial ?? {
      category_id: categories[0]?.id ?? "",
      category_name: categories[0]?.name ?? "",
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(initial?.image_url ?? null);
    setImageError(null);
  }, [initial?.id, categories]);

  const set = (key: string, value: any) => setItem((prev: any) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={async (e) => {
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
            const selectedCategory = categories.find((c: any) => c.id === item.category_id);
            finalImageUrl = await uploadImageToBucket(imageFile, "subcategories", selectedCategory?.name || item.name, "subcat");
          }
          onSave({
            ...item,
            name: trimmedName,
            slug: trimmedSlug,
            category_name: categories.find((c: any) => c.id === item.category_id)?.name ?? item.category_name,
            image_url: finalImageUrl,
          });
        } catch (error: any) {
          toast.error(error?.message || "Failed to upload image");
        } finally {
          setIsUploading(false);
        }
      }}
      className="space-y-4"
    >
      <div>
        <Label>Category</Label>
        <Select value={item.category_id ?? ""} onValueChange={(value) => {
          const category = categories.find((c: any) => c.id === value);
          set("category_id", value);
          set("category_name", category?.name ?? "");
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Subcategory Name *</Label>
          <Input value={item.name ?? ""} onChange={(e) => {
            set("name", e.target.value);
            if (!initial?.id) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
          }} placeholder="Premium Rice" />
        </div>
        <div>
          <Label>Slug</Label>
          <Input value={item.slug ?? ""} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="premium-rice" />
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Input value={item.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Short description" />
      </div>
      <div>
        <Label>Upload Image</Label>
        <div className="mt-2 flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
            {imagePreview ? <img src={imagePreview} alt="subcategory preview" className="h-full w-full object-cover" /> : <Tag className="h-8 w-8 text-muted-foreground/50" />}
            {imagePreview && (
              <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100" onClick={() => { setImageFile(null); setImagePreview(null); set("image_url", ""); }}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex-1">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
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
            }} />
            <Button type="button" variant="outline" className="mb-2" onClick={() => fileInputRef.current?.click()}>{imagePreview ? "Replace Image" : "Upload Image"}</Button>
            {imageError && <p className="mb-2 text-sm text-destructive">{imageError}</p>}
            <p className="text-xs text-muted-foreground">JPG, JPEG, PNG, or WEBP. Max size 5MB.</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
        <input type="checkbox" checked={item.is_active !== false} onChange={(e) => set("is_active", e.target.checked)} className="h-4 w-4 rounded" />
        <Label className="cursor-pointer">Active / Visible</Label>
      </div>
      <Button type="submit" disabled={pending || isUploading} className="w-full rounded-full">
        {(pending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Subcategory" : "Create Subcategory"}
      </Button>
    </form>
  );
}

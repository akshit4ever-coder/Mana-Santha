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

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories-full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (c: any) => {
      const payload = {
        name: c.name,
        slug: c.slug,
        description: c.description || null,
        icon: c.icon || null,
        image_url: c.image_url || null,
        is_active: c.is_active !== false,
      };

      const { data: existing, error: lookupError } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", c.name.trim())
        .maybeSingle();
      if (lookupError) throw lookupError;
      if (existing && existing.id !== c.id) {
        throw new Error("A category with this name already exists.");
      }

      if (c.id) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", c.id);
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
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("categories")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories-full"] });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("Category deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories?.length ?? 0} categories
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
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit" : "New"} Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              initial={editing}
              onSave={(c: any) => save.mutate(c)}
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
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <span className="text-2xl">{c.icon || "📦"}</span>
                  </TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.slug}
                  </TableCell>
                  <TableCell>
                    {c.is_active ? (
                      <Badge className="bg-success text-success-foreground">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title={c.is_active ? "Hide" : "Show"}
                        onClick={() =>
                          toggle.mutate({ id: c.id, is_active: !c.is_active })
                        }
                      >
                        {c.is_active ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditing(c);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        title="Delete category"
                        onClick={() => {
                          if (confirm(`Delete "${c.name}" and its subcategories/products?`)) {
                            remove.mutate(c.id);
                          }
                        }}
                      >
                        <Tag className="h-4 w-4" />
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

function CategoryForm({
  initial,
  onSave,
  pending,
}: {
  initial: any;
  onSave: (c: any) => void;
  pending: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image_url ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [c, setC] = useState<any>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      icon: "",
      image_url: "",
      is_active: true,
    }
  );
  const set = (k: string, v: any) => setC((prev: any) => ({ ...prev, [k]: v }));

  useEffect(() => {
    setC(initial ?? {
      name: "",
      slug: "",
      description: "",
      icon: "",
      image_url: "",
      is_active: true,
    });
    setImageFile(null);
    setImagePreview(initial?.image_url ?? null);
    setImageError(null);
  }, [initial?.id]);

  return (
    <form
      onSubmit={async (e) => {
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Name *</Label>
          <Input
            required
            value={c.name}
            onChange={(e) => {
              set("name", e.target.value);
              if (!initial?.id)
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                );
            }}
            placeholder="Category name"
          />
        </div>
        <div>
          <Label>Icon (Emoji)</Label>
          <Input
            value={c.icon ?? ""}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="🥬"
            maxLength={4}
          />
        </div>
      </div>
      <div>
        <Label>Slug *</Label>
        <Input
          required
          value={c.slug}
          onChange={(e) =>
            set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
          }
          placeholder="fruits-vegetables"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={c.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description"
        />
      </div>
      <div className="flex items-end pb-1">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={c.is_active !== false}
            onChange={(e) => set("is_active", e.target.checked)}
            className="h-4 w-4 rounded"
          />
          Active / Visible
        </label>
      </div>
      <div>
        <Label>Upload Image</Label>
        <div className="mt-2 flex items-start gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="category preview" className="h-full w-full object-cover" />
            ) : (
              <Tag className="h-8 w-8 text-muted-foreground/50" />
            )}
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
      <Button type="submit" disabled={pending || isUploading} className="w-full rounded-full">
        {(pending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
}

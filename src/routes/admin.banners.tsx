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
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Eye, EyeOff, Image } from "lucide-react";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("position");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (b: any) => {
      const payload = {
        title: b.title,
        description: b.description || null,
        image_url: b.image_url,
        link_url: b.link_url || null,
        position: Number(b.position) || 0,
        is_active: b.is_active !== false,
        valid_from: b.valid_from || new Date().toISOString(),
        valid_till: b.valid_till || null,
      };
      if (b.id) {
        const { error } = await supabase
          .from("banners")
          .update(payload)
          .eq("id", b.id);
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
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("banners")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Banners</h1>
          <p className="text-sm text-muted-foreground">
            {banners?.length ?? 0} banners
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
              New Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit" : "New"} Banner</DialogTitle>
            </DialogHeader>
            <BannerForm
              initial={editing}
              onSave={(b: any) => save.mutate(b)}
              pending={save.isPending}
            />
          </DialogContent>
        </Dialog>
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
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Valid Till</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    <Image className="mx-auto mb-2 h-10 w-10 opacity-30" />
                    No banners yet. Create your first banner!
                  </TableCell>
                </TableRow>
              ) : (
                banners?.map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell>
                      <img
                        src={b.image_url}
                        alt={b.title}
                        className="h-14 w-24 rounded-lg object-cover border"
                        onError={(e: any) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{b.title}</div>
                      {b.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {b.description}
                        </div>
                      )}
                      {b.link_url && (
                        <div className="text-xs text-primary truncate max-w-xs">
                          → {b.link_url}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{b.position}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {b.valid_till
                        ? new Date(b.valid_till).toLocaleDateString("en-IN")
                        : "No expiry"}
                    </TableCell>
                    <TableCell>
                      {b.is_active ? (
                        <Badge className="bg-success text-success-foreground">
                          Active
                        </Badge>
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
                          onClick={() =>
                            toggle.mutate({ id: b.id, is_active: !b.is_active })
                          }
                        >
                          {b.is_active ? (
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
                            setEditing(b);
                            setOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function BannerForm({
  initial,
  onSave,
  pending,
}: {
  initial: any;
  onSave: (b: any) => void;
  pending: boolean;
}) {
  const [b, setB] = useState<any>(
    initial ?? {
      title: "",
      description: "",
      image_url: "",
      link_url: "",
      position: 0,
      valid_from: new Date().toISOString().slice(0, 10),
      valid_till: "",
      is_active: true,
    }
  );
  const set = (k: string, v: any) => setB((prev: any) => ({ ...prev, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(b);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Title *</Label>
        <Input
          required
          value={b.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Summer Sale — Up to 30% Off"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={b.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short subtitle for the banner"
        />
      </div>
      <div>
        <Label>Image URL *</Label>
        <Input
          type="url"
          required
          value={b.image_url}
          onChange={(e) => set("image_url", e.target.value)}
          placeholder="https://..."
        />
        {b.image_url && (
          <img
            src={b.image_url}
            alt="preview"
            className="mt-2 h-24 w-full rounded-lg object-cover border"
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
          />
        )}
      </div>
      <div>
        <Label>Link URL (optional)</Label>
        <Input
          type="url"
          value={b.link_url ?? ""}
          onChange={(e) => set("link_url", e.target.value)}
          placeholder="/category/fruits-vegetables"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Position</Label>
          <Input
            type="number"
            min="0"
            value={b.position}
            onChange={(e) => set("position", e.target.value)}
          />
        </div>
        <div>
          <Label>Valid From</Label>
          <Input
            type="date"
            value={b.valid_from?.slice(0, 10)}
            onChange={(e) => set("valid_from", e.target.value)}
          />
        </div>
        <div>
          <Label>Valid Till</Label>
          <Input
            type="date"
            value={b.valid_till?.slice(0, 10) ?? ""}
            onChange={(e) => set("valid_till", e.target.value)}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={b.is_active !== false}
          onChange={(e) => set("is_active", e.target.checked)}
          className="h-4 w-4 rounded"
        />
        Active (show on homepage)
      </label>
      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Banner" : "Create Banner"}
      </Button>
    </form>
  );
}

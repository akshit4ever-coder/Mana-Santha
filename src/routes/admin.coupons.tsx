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
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

function AdminCoupons() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (c: any) => {
      const payload = {
        code: c.code.toUpperCase().trim(),
        description: c.description || null,
        discount_type: c.discount_type,
        discount_value: Number(c.discount_value),
        max_discount: c.max_discount ? Number(c.max_discount) : null,
        min_cart_value: Number(c.min_cart_value) || 0,
        usage_limit: c.usage_limit ? Number(c.usage_limit) : null,
        per_user_limit: Number(c.per_user_limit) || 1,
        active_from: c.active_from || new Date().toISOString(),
        active_till: c.active_till || null,
        is_active: c.is_active !== false,
      };
      if (c.id) {
        const { error } = await supabase
          .from("coupons")
          .update(payload)
          .eq("id", c.id);
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
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("coupons")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            {coupons?.length ?? 0} coupons created
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
              New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing?.id ? "Edit" : "New"} Coupon</DialogTitle>
            </DialogHeader>
            <CouponForm
              initial={editing}
              onSave={(c: any) => save.mutate(c)}
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
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Cart</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Till</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    No coupons yet. Create your first coupon!
                  </TableCell>
                </TableRow>
              ) : (
                coupons?.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-2 py-0.5 font-mono font-bold text-primary">
                        {c.code}
                      </code>
                      {c.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {c.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {c.discount_type === "percentage"
                        ? `${c.discount_value}% OFF`
                        : `${formatINR(c.discount_value)} OFF`}
                      {c.max_discount && (
                        <div className="text-xs text-muted-foreground">
                          max {formatINR(c.max_discount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatINR(c.min_cart_value)}</TableCell>
                    <TableCell>
                      {c.used_count}
                      {c.usage_limit && ` / ${c.usage_limit}`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.active_till
                        ? new Date(c.active_till).toLocaleDateString("en-IN")
                        : "No expiry"}
                    </TableCell>
                    <TableCell>
                      {c.is_active ? (
                        <Badge className="bg-success text-success-foreground">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title={c.is_active ? "Deactivate" : "Activate"}
                          onClick={() =>
                            toggle.mutate({ id: c.id, is_active: !c.is_active })
                          }
                        >
                          {c.is_active ? (
                            <ToggleRight className="h-4 w-4 text-success" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-muted-foreground" />
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

function CouponForm({
  initial,
  onSave,
  pending,
}: {
  initial: any;
  onSave: (c: any) => void;
  pending: boolean;
}) {
  const [c, setC] = useState<any>(
    initial ?? {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      max_discount: "",
      min_cart_value: 0,
      usage_limit: "",
      per_user_limit: 1,
      active_from: new Date().toISOString().slice(0, 10),
      active_till: "",
      is_active: true,
    }
  );
  const set = (k: string, v: any) => setC((prev: any) => ({ ...prev, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(c);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Coupon Code *</Label>
          <Input
            required
            value={c.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            placeholder="SAVE10"
          />
        </div>
        <div>
          <Label>Discount Type *</Label>
          <Select
            value={c.discount_type}
            onValueChange={(v) => set("discount_type", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage (%)</SelectItem>
              <SelectItem value="flat">Flat Amount (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>
            Discount Value *{" "}
            {c.discount_type === "percentage" ? "(%)" : "(₹)"}
          </Label>
          <Input
            type="number"
            min="0"
            required
            value={c.discount_value}
            onChange={(e) => set("discount_value", e.target.value)}
          />
        </div>
        {c.discount_type === "percentage" && (
          <div>
            <Label>Max Discount (₹)</Label>
            <Input
              type="number"
              min="0"
              value={c.max_discount ?? ""}
              onChange={(e) => set("max_discount", e.target.value)}
              placeholder="Optional cap"
            />
          </div>
        )}
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={c.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description for this coupon"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Min Cart Value (₹)</Label>
          <Input
            type="number"
            min="0"
            value={c.min_cart_value}
            onChange={(e) => set("min_cart_value", e.target.value)}
          />
        </div>
        <div>
          <Label>Usage Limit (total)</Label>
          <Input
            type="number"
            min="1"
            value={c.usage_limit ?? ""}
            onChange={(e) => set("usage_limit", e.target.value)}
            placeholder="Unlimited"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Valid From</Label>
          <Input
            type="date"
            value={c.active_from?.slice(0, 10)}
            onChange={(e) => set("active_from", e.target.value)}
          />
        </div>
        <div>
          <Label>Valid Till</Label>
          <Input
            type="date"
            value={c.active_till?.slice(0, 10) ?? ""}
            onChange={(e) => set("active_till", e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={c.is_active !== false}
          onChange={(e) => set("is_active", e.target.checked)}
          className="h-4 w-4 rounded"
        />
        Active (visible to customers)
      </label>

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}

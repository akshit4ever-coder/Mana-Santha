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
import { Loader2, Pencil, Plus, Bike, Star } from "lucide-react";

export const Route = createFileRoute("/admin/delivery")({
  component: AdminDelivery,
});

function AdminDelivery() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const { data: partners, isLoading } = useQuery({
    queryKey: ["admin-delivery-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delivery_partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (p: any) => {
      const payload = {
        name: p.name,
        phone: p.phone,
        email: p.email || null,
        vehicle_number: p.vehicle_number || null,
        vehicle_type: p.vehicle_type || "bike",
        is_active: p.is_active !== false,
      };
      if (p.id) {
        const { error } = await supabase
          .from("delivery_partners")
          .update(payload)
          .eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("delivery_partners")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-delivery-partners"] });
      toast.success("Delivery partner saved");
      setOpen(false);
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("delivery_partners")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-delivery-partners"] }),
  });

  const activeCount = partners?.filter((p: any) => p.is_active).length ?? 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Delivery Partners</h1>
          <p className="text-sm text-muted-foreground">
            {activeCount} active · {partners?.length ?? 0} total
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
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing?.id ? "Edit" : "Add"} Delivery Partner
              </DialogTitle>
            </DialogHeader>
            <PartnerForm
              initial={editing}
              onSave={(p: any) => save.mutate(p)}
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
                <TableHead>Partner</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Bike className="mx-auto mb-2 h-10 w-10 opacity-30" />
                    No delivery partners yet. Add your first partner!
                  </TableCell>
                </TableRow>
              ) : (
                partners?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          {p.email && (
                            <div className="text-xs text-muted-foreground">
                              {p.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{p.phone}</TableCell>
                    <TableCell>
                      <div className="text-sm capitalize">
                        {p.vehicle_type || "bike"}
                      </div>
                      {p.vehicle_number && (
                        <div className="font-mono text-xs text-muted-foreground">
                          {p.vehicle_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {Number(p.rating).toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {p.total_deliveries}
                    </TableCell>
                    <TableCell>
                      {p.is_active ? (
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
                          size="sm"
                          variant={p.is_active ? "outline" : "default"}
                          className="h-7 rounded-full text-xs"
                          onClick={() =>
                            toggle.mutate({ id: p.id, is_active: !p.is_active })
                          }
                        >
                          {p.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditing(p);
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

function PartnerForm({
  initial,
  onSave,
  pending,
}: {
  initial: any;
  onSave: (p: any) => void;
  pending: boolean;
}) {
  const [p, setP] = useState<any>(
    initial ?? {
      name: "",
      phone: "",
      email: "",
      vehicle_number: "",
      vehicle_type: "bike",
      is_active: true,
    }
  );
  const set = (k: string, v: any) => setP((prev: any) => ({ ...prev, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(p);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Full Name *</Label>
        <Input
          required
          value={p.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Partner name"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Phone *</Label>
          <Input
            required
            type="tel"
            value={p.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="10-digit number"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={p.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Vehicle Type</Label>
          <Select
            value={p.vehicle_type}
            onValueChange={(v) => set("vehicle_type", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bike">🏍️ Bike</SelectItem>
              <SelectItem value="bicycle">🚲 Bicycle</SelectItem>
              <SelectItem value="scooter">🛵 Scooter</SelectItem>
              <SelectItem value="car">🚗 Car</SelectItem>
              <SelectItem value="auto">🛺 Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Vehicle Number</Label>
          <Input
            value={p.vehicle_number ?? ""}
            onChange={(e) =>
              set("vehicle_number", e.target.value.toUpperCase())
            }
            placeholder="AP 01 AB 1234"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={p.is_active !== false}
          onChange={(e) => set("is_active", e.target.checked)}
          className="h-4 w-4 rounded"
        />
        Active (available for deliveries)
      </label>
      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {initial?.id ? "Update Partner" : "Add Partner"}
      </Button>
    </form>
  );
}

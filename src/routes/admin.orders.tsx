import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const STATUSES = ["pending","confirmed","packed","out_for_delivery","delivered","cancelled","refunded"];

const formatDeliveryAddress = (snapshot: any) => {
  if (!snapshot) return "Address not available";
  return [snapshot.line1, snapshot.line2, snapshot.city, snapshot.state, snapshot.pincode]
    .filter(Boolean)
    .join(", ");
};

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (
      await supabase
        .from("orders")
        .select("*, order_items(*), profiles: user_id(full_name, phone)")
        .order("created_at", { ascending: false })
    ).data,
  });

  const upd = useMutation({
    mutationFn: async ({ id, status }: any) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success("Order updated"); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">Orders</h1>
      <div className="rounded-xl border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((o: any) => {
              const customerName = o.profiles?.full_name || o.address_snapshot?.full_name || "Unknown customer";
              const customerPhone = o.profiles?.phone || o.address_snapshot?.phone || "No phone";
              const deliveryAddress = formatDeliveryAddress(o.address_snapshot);

              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="font-medium">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium">{customerName}</div>
                    <div className="text-xs text-muted-foreground">{customerPhone}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-[220px]">{deliveryAddress}</div>
                    <div className="text-xs text-muted-foreground">{o.address_snapshot?.city || "City not available"}{o.address_snapshot?.state ? `, ${o.address_snapshot.state}` : ""}</div>
                  </TableCell>
                  <TableCell>{o.order_items?.length}</TableCell>
                  <TableCell className="font-semibold">{formatINR(o.total)}</TableCell>
                  <TableCell className="text-sm uppercase">{o.payment_method}</TableCell>
                  <TableCell>
                    <Select value={o.status} onValueChange={(v) => upd.mutate({ id: o.id, status: v })}>
                      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

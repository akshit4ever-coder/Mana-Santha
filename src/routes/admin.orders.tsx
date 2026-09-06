import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const STATUSES = ["pending","confirmed","packed","out_for_delivery","delivered","cancelled","refunded"];
const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700",
  confirmed: "bg-blue-500/15 text-blue-700",
  packed: "bg-purple-500/15 text-purple-700",
  out_for_delivery: "bg-orange-500/15 text-orange-700",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
  refunded: "bg-gray-500/15 text-gray-700",
};

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered"],
  delivered: ["refunded"],
  cancelled: [],
  refunded: [],
};

const formatDeliveryAddress = (snapshot: any) => {
  if (!snapshot) return "Address not available";
  return [snapshot.line1, snapshot.line2, snapshot.city, snapshot.state, snapshot.pincode]
    .filter(Boolean)
    .join(", ");
};

function getAllowedStatuses(currentStatus: string) {
  const value = String(currentStatus || "").trim().toLowerCase();
  if (!value) return STATUSES;

  if (value === "delivered") return [];
  if (value === "cancelled" || value === "refunded") return [];

  const allowed = ALLOWED_TRANSITIONS[value] || [];
  const currentIndex = STATUSES.indexOf(value);

  if (allowed.length > 0) {
    return [value, ...allowed];
  }

  if (currentIndex >= 0) {
    return [value];
  }

  return STATUSES;
}

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const upd = useMutation({
    mutationFn: async ({ id, status }: any) => {
      const { updateOrderStatus } = await import("@/serverFns/updateOrderStatus.functions");
      const result = await updateOrderStatus({ data: { id, status } });
      if (!result?.success) {
        throw new Error(result?.error || "Invalid order status transition.");
      }
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated");
    },
    onError: (e: Error) => toast.error(e.message || "Invalid order status transition."),
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
              const customerName = o.address_snapshot?.full_name || "Unknown customer";
              const customerPhone = o.address_snapshot?.phone || "No phone";
              const deliveryAddress = formatDeliveryAddress(o.address_snapshot);
              const currentStatus = String(o.status || "").toLowerCase();
              const isCancelled = currentStatus === "cancelled";
              const isDelivered = currentStatus === "delivered";
              const isRefunded = currentStatus === "refunded";
              const allowedStatuses = getAllowedStatuses(currentStatus);
              const cancelledLabel = o.cancelled_by === "admin" ? "Cancelled by Admin" : "Cancelled by Customer";

              return (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="font-medium">{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium">{customerName}</div>
                    <div className="text-xs text-muted-foreground">{customerPhone}</div>
                    {isCancelled && (
                      <div className="mt-1 text-[10px] uppercase tracking-wide text-red-600">{cancelledLabel}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="max-w-[220px]">{deliveryAddress}</div>
                    <div className="text-xs text-muted-foreground">{o.address_snapshot?.city || "City not available"}{o.address_snapshot?.state ? `, ${o.address_snapshot.state}` : ""}</div>
                    {isCancelled && o.cancellation_reason && (
                      <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-700">Reason: {o.cancellation_reason}</div>
                    )}
                  </TableCell>
                  <TableCell>{o.order_items?.length ?? 0}</TableCell>
                  <TableCell className="font-semibold">{formatINR(o.total)}</TableCell>
                  <TableCell className="text-sm uppercase">{o.payment_method}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {isDelivered ? (
                        <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          ✓ Delivered (Final)
                        </div>
                      ) : isCancelled || isRefunded ? (
                        <div className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {isCancelled ? cancelledLabel : "Refunded"}
                        </div>
                      ) : (
                        <Select value={o.status} onValueChange={(v) => upd.mutate({ id: o.id, status: v })}>
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {allowedStatuses.map((s) => (
                              <SelectItem key={s} value={s} disabled={!ALLOWED_TRANSITIONS[currentStatus]?.includes(s) && s !== currentStatus}>
                                {s.replace(/_/g, " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {isCancelled && o.updated_at && (
                        <div className="text-[10px] text-muted-foreground">Cancelled at: {new Date(o.updated_at).toLocaleString("en-IN")}</div>
                      )}

                      {isDelivered && (
                        <div className="text-[10px] text-muted-foreground">
                          This order has been delivered and can no longer be modified.
                        </div>
                      )}
                    </div>
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

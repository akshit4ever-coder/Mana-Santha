import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/UI/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { toast } from "sonner";

const adminOrdersSearchSchema = z.object({
  filter: z.enum(["all", "today", "pending"]).optional().default("all"),
});

export const Route = createFileRoute("/admin/orders")({
  validateSearch: adminOrdersSearchSchema,
  component: AdminOrders,
});

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

function formatDisplayDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

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
  const { filter } = Route.useSearch();
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  const { data: orders } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: async () => {
      let query = supabase.from("orders").select("*");

      if (filter === "today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        query = query.gte("created_at", startOfToday.toISOString());
      }

      if (filter === "pending") {
        query = query.eq("status", "pending");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
  });

  const billOrder = useMemo(() => {
    if (!selectedBill) return null;

    const lineItems = Array.isArray(selectedBill.order_items) ? selectedBill.order_items : [];
    const subtotal = lineItems.reduce((sum: number, item: any) => sum + Number(item.subtotal || item.price * item.quantity || 0), 0);
    const deliveryFee = Number(selectedBill.delivery_fee || 0);
    const discount = Number(selectedBill.discount || 0);
    const grandTotal = Number(selectedBill.total || subtotal + deliveryFee - discount);

    return {
      ...selectedBill,
      lineItems,
      subtotal,
      deliveryFee,
      discount,
      grandTotal,
    };
  }, [selectedBill]);

  const handlePrintBill = () => {
    const invoiceNode = document.querySelector(".bill-print");
    if (!invoiceNode) {
      window.print();
      return;
    }

    const printRoot = document.createElement("div");
    printRoot.id = "mana-santha-bill-print-root";
    printRoot.innerHTML = invoiceNode.outerHTML;

    const existingRoot = document.getElementById("mana-santha-bill-print-root");
    if (existingRoot) existingRoot.remove();

    document.body.appendChild(printRoot);

    const removePrintRoot = () => {
      const root = document.getElementById("mana-santha-bill-print-root");
      if (root) root.remove();
      document.body.style.padding = "";
    };

    document.body.style.padding = "0";

    const style = document.createElement("style");
    style.textContent = `
      @media print {
        @page { size: A4 portrait; margin: 10mm 8mm; }
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          height: auto !important;
          overflow: visible !important;
        }
        body > *:not(#mana-santha-bill-print-root) {
          display: none !important;
        }
        #mana-santha-bill-print-root {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
          box-shadow: none !important;
          overflow: visible !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        #mana-santha-bill-print-root .bill-print {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: none !important;
          overflow: visible !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .no-print { display: none !important; }
      }
    `;

    document.head.appendChild(style);

    window.addEventListener("afterprint", removePrintRoot, { once: true });
    window.setTimeout(() => window.print(), 50);
  };

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

  const title = filter === "today" ? "Today's Orders" : filter === "pending" ? "Pending Orders" : "Orders";

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">{title}</h1>
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
                    <div className="mt-2 text-xs font-medium text-primary">
                      Delivery: {o.delivery_date ? new Date(o.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today (same day)"}
                    </div>
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

                      <Button variant="outline" size="sm" onClick={() => setSelectedBill(o)}>
                        View Bill
                      </Button>

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

      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Bill</DialogTitle>
            <DialogDescription>
              Proof of purchase for order #{billOrder?.order_number || selectedBill?.order_number || "—"}
            </DialogDescription>
          </DialogHeader>

          {billOrder && (
            <div className="space-y-4">
              <style>{`
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 10mm 8mm;
                  }

                  html, body {
                    height: auto !important;
                    overflow: visible !important;
                    background: #fff !important;
                  }

                  body * {
                    visibility: hidden;
                  }

                  .bill-print,
                  .bill-print * {
                    visibility: visible;
                  }

                  .bill-print {
                    position: static !important;
                    display: block !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    min-height: auto !important;
                    height: auto !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: 1px solid #e5e7eb !important;
                    box-shadow: none !important;
                    overflow: visible !important;
                    break-inside: avoid;
                    page-break-inside: avoid;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }

                  .no-print,
                  [data-radix-portal],
                  .dialog-overlay,
                  [role="dialog"] > *:not(.bill-print) {
                    display: none !important;
                    visibility: hidden !important;
                  }
                }
              `}</style>

              <div className="bill-print rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="text-xl font-bold text-emerald-700 sm:text-2xl">Mana Santa</div>
                    <div className="text-[10px] text-muted-foreground sm:text-xs">Fresh groceries & essentials</div>
                  </div>
                  <div className="text-right text-[11px] sm:text-sm">
                    <div className="font-semibold">Bill No: {billOrder.order_number}</div>
                    <div className="text-muted-foreground">{formatDisplayDate(billOrder.created_at)}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">Customer</div>
                    <div className="mt-1 text-sm font-medium">{billOrder.address_snapshot?.full_name || "Unknown customer"}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">Delivery address</div>
                    <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {[
                        billOrder.address_snapshot?.line1,
                        billOrder.address_snapshot?.line2,
                        billOrder.address_snapshot?.city,
                        billOrder.address_snapshot?.state,
                        billOrder.address_snapshot?.pincode,
                      ].filter(Boolean).join(", ") || "Address not available"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border bg-slate-50 p-2 text-[11px] sm:p-3 sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium capitalize">{String(billOrder.status || "pending").replace(/_/g, " ")}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-medium">{billOrder.payment_method === "cod" ? "Cash on Delivery" : "Paid online"}</span>
                  </div>
                </div>
                {billOrder.status === "cancelled" && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <div className="font-semibold">Cancellation</div>
                    <div className="mt-1">{billOrder.cancellation_reason || "Order cancelled by customer."}</div>
                    {billOrder.updated_at && (
                      <div className="mt-1 text-xs">Cancelled on: {formatDisplayDate(billOrder.updated_at)}</div>
                    )}
                  </div>
                )}
                <div className="mt-4 overflow-hidden rounded-lg border">
                  <table className="w-full text-left text-[11px] sm:text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-2 py-2 font-medium sm:px-3">Item</th>
                        <th className="px-2 py-2 text-center font-medium sm:px-3">Qty</th>
                        <th className="px-2 py-2 text-right font-medium sm:px-3">Price</th>
                        <th className="px-2 py-2 text-right font-medium sm:px-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billOrder.lineItems.map((item: any) => (
                        <tr key={item.id || item.name} className="border-t">
                          <td className="px-2 py-2 sm:px-3">{item.name}</td>
                          <td className="px-2 py-2 text-center sm:px-3">{item.quantity}</td>
                          <td className="px-2 py-2 text-right sm:px-3">{formatINR(item.price)}</td>
                          <td className="px-2 py-2 text-right sm:px-3">{formatINR(item.subtotal || Number(item.price || 0) * Number(item.quantity || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 ml-auto max-w-[220px] space-y-2 text-[11px] sm:max-w-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(billOrder.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{formatINR(billOrder.deliveryFee)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-{formatINR(billOrder.discount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t pt-2 text-sm font-bold sm:text-base">
                    <span>Total</span>
                    <span>{formatINR(billOrder.grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3 text-[10px] text-muted-foreground sm:text-xs">
                  This bill is the official proof of purchase for this order.
                </div>
              </div>

              <div className="no-print flex justify-end gap-2">
                <Button variant="outline" onClick={handlePrintBill}>Print Bill</Button>
                <Button onClick={() => setSelectedBill(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

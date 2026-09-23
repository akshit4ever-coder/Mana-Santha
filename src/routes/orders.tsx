import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/lib/auth";
import { useOrders } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { Textarea } from "@/components/UI/textarea";
import { Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PLACEHOLDER_IMAGE } from "@/lib/product-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Mana Santa" }, { name: "description", content: "Track your Mana Santa orders." }] }),
  component: OrdersPage,
});

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-700",
  confirmed: "bg-blue-500/15 text-blue-700",
  packed: "bg-purple-500/15 text-purple-700",
  out_for_delivery: "bg-orange-500/15 text-orange-700",
  delivered: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
  refunded: "bg-gray-500/15 text-gray-700",
};

function formatDisplayDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getOrderTotalQuantity(items: any[] = []) {
  return (items || []).reduce((sum: number, item: any) => sum + Number(item?.quantity || 0), 0);
}

function getOrderItemSizeLabel(item: any) {
  const sizePieces = [
    item?.variant_name,
    item?.unit,
    item?.variant_unit,
    item?.weight,
    item?.size,
  ].filter(Boolean);

  if (sizePieces.length === 0) return "";
  return sizePieces[0];
}

function formatOrderItemSummary(item: any) {
  const sizeLabel = getOrderItemSizeLabel(item);
  const quantity = Number(item?.quantity || 0);
  const unitPrice = Number(item?.price || 0);
  const subtotal = Number(item?.subtotal || unitPrice * quantity || 0);

  return `${item?.name || "Product"}${sizeLabel ? ` — ${sizeLabel}` : ""} × ${quantity} — ${formatINR(unitPrice)} each — ${formatINR(subtotal)}`;
}

function OrdersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: orders } = useOrders(user?.id);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelNote, setCancelNote] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelOrder = async () => {
    if (!user || !cancelTarget) return;

    const reason = cancelReason || "Changed my mind";
    const detailedReason = cancelNote.trim() ? `${reason} — ${cancelNote.trim()}` : reason;

    setIsCancelling(true);

    try {
      const timestamp = new Date().toISOString();

      let updatePayload: Record<string, any> = {
        status: "cancelled",
        updated_at: timestamp,
      };

      try {
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            ...updatePayload,
            cancellation_reason: detailedReason,
          })
          .eq("id", cancelTarget.id);

        if (updateError) throw updateError;
      } catch (error: any) {
        const message = error?.message || "";
        if (!message.toLowerCase().includes("column") || !message.toLowerCase().includes("does not exist")) {
          throw error;
        }

        const { error: fallbackError } = await supabase
          .from("orders")
          .update(updatePayload)
          .eq("id", cancelTarget.id);

        if (fallbackError) throw fallbackError;
      }

      const payload = {
        orderNumber: cancelTarget.order_number || cancelTarget.id,
        customerName: cancelTarget.address_snapshot?.full_name || user?.user_metadata?.full_name || user.email || "Customer",
        customerPhone: cancelTarget.address_snapshot?.phone || user?.phone || "Not available",
        customerEmail: user.email || "",
        totalAmount: cancelTarget.total,
        cancellationReason: detailedReason,
        cancellationTime: new Date().toISOString(),
      };

      try {
        const { notifyOrderCancellation } = await import("../serverFns/notifyOrder.functions");
        await notifyOrderCancellation({ data: payload as any });
      } catch (emailError) {
        console.error("Cancellation email failed:", emailError);
      }

      qc.invalidateQueries({ queryKey: ["orders", user.id] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order cancelled successfully.");
      setCancelTarget(null);
      setCancelReason("");
      setCancelNote("");
    } catch (error: any) {
      console.error("Cancel order failed:", error);
      toast.error(error.message || "Unable to cancel this order.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (!user) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Please <Link to="/auth" className="text-primary underline">sign in</Link>.</div></div>);

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">My Orders</h1>
        {(!orders || orders.length === 0) ? (
          <div className="rounded-xl border bg-card p-16 text-center shadow-card">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold">No orders yet</p>
            <Link to="/" className="mt-4 inline-block text-primary underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => {
              const isCancellable = ["pending", "processing"].includes(String(o.status || "").toLowerCase());
              const isCancelled = String(o.status || "").toLowerCase() === "cancelled";

              return (
                <div key={o.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Order #{o.order_number}</div>
                      <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                      <div className="mt-1 text-xs text-primary">Delivery by: {o.delivery_date ? new Date(o.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today (same day)"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColor[o.status] ?? ""}>{(o.status || "pending").replace(/_/g, " ")}</Badge>
                      {isCancelled && o.cancellation_reason ? (
                        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Cancelled by Customer</Badge>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-3">
                      <div className="rounded-lg border bg-secondary/20 p-3 text-sm">
                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Delivery to</div>
                        <div className="mt-1 font-medium">{o.address_snapshot?.full_name || user.full_name || "Customer"}</div>
                        <div className="text-muted-foreground">{o.address_snapshot?.phone || user.phone || "Phone not available"}</div>
                        <div className="text-muted-foreground">{[
                          o.address_snapshot?.line1,
                          o.address_snapshot?.line2,
                          o.address_snapshot?.city,
                          o.address_snapshot?.state,
                          o.address_snapshot?.pincode,
                        ].filter(Boolean).join(", ") || "Address not available"}</div>
                        <div className="mt-2 text-xs font-medium text-primary">
                          Delivery date: {o.delivery_date ? new Date(o.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Today (same day)"}
                        </div>
                      </div>

                      {isCancelled && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          <div className="font-medium">Cancellation reason</div>
                          <div>{o.cancellation_reason || "Not provided"}</div>
                          {o.updated_at && (
                            <div className="mt-1 text-xs">Cancelled on: {new Date(o.updated_at).toLocaleString("en-IN")}</div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {o.order_items?.slice(0, 4).map((it: any) => (
                          <div key={it.id} className="flex items-center gap-2 rounded-lg border bg-secondary/40 px-2 py-1 text-xs">
                            <img
                              src={it.image_url || PLACEHOLDER_IMAGE}
                              alt={it.name || ""}
                              className="h-8 w-8 rounded object-cover"
                              onError={(e) => {
                                // Replace missing or failing images with placeholder and log for diagnosis
                                try {
                                  const img = e.currentTarget as HTMLImageElement;
                                  if (img && img.src && !img.src.includes(PLACEHOLDER_IMAGE)) {
                                    if (import.meta.env.DEV) console.warn("Product image failed to load:", img.src, "— falling back to placeholder.");
                                    img.onerror = null;
                                    img.src = PLACEHOLDER_IMAGE;
                                  }
                                } catch (_) {
                                  // ignore
                                }
                              }}
                            />
                            <div className="min-w-0">
                              <div className="line-clamp-1 max-w-40 font-medium">{it.name}</div>
                              <div className="text-muted-foreground">
                                {getOrderItemSizeLabel(it) ? `${getOrderItemSizeLabel(it)} × ${it.quantity}` : `Qty ${it.quantity}`}
                              </div>
                            </div>
                          </div>
                        ))}
                        {o.order_items?.length > 4 && (<div className="rounded-lg bg-secondary px-2 py-1 text-xs">+{o.order_items.length - 4} more</div>)}
                        <div className="w-full text-[11px] text-muted-foreground">
                          Total quantity: <span className="font-medium text-foreground">{getOrderTotalQuantity(o.order_items)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="text-xl font-bold">{formatINR(o.total)}</div>
                      <div className="text-xs text-muted-foreground">{getOrderTotalQuantity(o.order_items)} qty</div>
                      <div className="text-xs text-muted-foreground">{o.payment_method === "cod" ? "Cash on Delivery" : "Paid online"}</div>

                      <div className="mt-3 flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedBill(o)}>
                          View Bill
                        </Button>

                        {isCancellable && !isCancelled && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setCancelTarget(o)}
                            disabled={isCancelling}
                          >
                            {isCancelling && cancelTarget?.id === o.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

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
                    <div className="mt-1 text-sm font-medium">{billOrder.address_snapshot?.full_name || user?.user_metadata?.full_name || user?.email || "Customer"}</div>
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
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[11px] text-red-700 sm:text-sm">
                    <div className="font-semibold">Cancellation</div>
                    <div className="mt-1">{billOrder.cancellation_reason || "Order cancelled by customer."}</div>
                    {billOrder.updated_at && (
                      <div className="mt-1 text-[10px]">Cancelled on: {formatDisplayDate(billOrder.updated_at)}</div>
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
                          <td className="px-2 py-2 sm:px-3">
                            <div className="font-medium">{item.name}</div>
                            {getOrderItemSizeLabel(item) && (
                              <div className="text-[10px] text-muted-foreground">{getOrderItemSizeLabel(item)}</div>
                            )}
                          </td>
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
                  Thank you for shopping with Mana Santa. This bill is your proof of purchase.
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

      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel order</DialogTitle>
            <DialogDescription>
              Please choose a reason for cancelling this order. This will restore the stock and notify the admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a cancellation reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Changed my mind">Changed my mind</SelectItem>
                  <SelectItem value="Ordered by mistake">Ordered by mistake</SelectItem>
                  <SelectItem value="Found better price elsewhere">Found better price elsewhere</SelectItem>
                  <SelectItem value="Need to postpone purchase">Need to postpone purchase</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional details (optional)</label>
              <Textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Add any extra detail for the cancellation"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={isCancelling}>Close</Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={isCancelling || !cancelReason}>
              {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

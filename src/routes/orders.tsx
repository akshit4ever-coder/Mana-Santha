import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Mana Santha" }, { name: "description", content: "Track your Mana Santha orders." }] }),
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

function OrdersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: orders } = useOrders(user?.id);
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [cancelNote, setCancelNote] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

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
                            <img src={it.image_url ?? ""} alt="" className="h-8 w-8 rounded object-cover" />
                            <span className="line-clamp-1 max-w-40">{it.name}</span>
                            <span className="text-muted-foreground">× {it.quantity}</span>
                          </div>
                        ))}
                        {o.order_items?.length > 4 && (<div className="rounded-lg bg-secondary px-2 py-1 text-xs">+{o.order_items.length - 4} more</div>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Total</div>
                      <div className="text-xl font-bold">{formatINR(o.total)}</div>
                      <div className="text-xs text-muted-foreground">{o.payment_method === "cod" ? "Cash on Delivery" : "Paid online"}</div>

                      {isCancellable && !isCancelled && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-3"
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
              );
            })}
          </div>
        )}
      </main>

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

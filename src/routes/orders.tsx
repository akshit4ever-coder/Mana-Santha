import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useAuth } from "@/lib/auth";
import { useOrders } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/UI/badge";
import { Package } from "lucide-react";

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
  const { data: orders } = useOrders(user?.id);

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
            {orders.map((o: any) => (
              <div key={o.id} className="rounded-xl border bg-card p-5 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Order #{o.order_number}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("en-IN")}</div>
                  </div>
                  <Badge className={statusColor[o.status] ?? ""}>{o.status.replace(/_/g, " ")}</Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
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
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-xl font-bold">{formatINR(o.total)}</div>
                    <div className="text-xs text-muted-foreground">{o.payment_method === "cod" ? "Cash on Delivery" : "Paid online"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

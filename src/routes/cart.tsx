import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { useAuth } from "@/lib/auth";
import { useCart, useRemoveCartItem, useUpdateCartQty } from "@/lib/queries";
import { formatINR } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/product-storage";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Mana Santha" }, { name: "description", content: "Review your cart and proceed to checkout." }] }),
  component: CartPage,
});

function CartPage() {
  const { user } = useAuth();
  const { data: cart } = useCart(user?.id);
  const upd = useUpdateCartQty(user?.id);
  const del = useRemoveCartItem(user?.id);

  const items = cart ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity, 0);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 29;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <div className="min-h-screen"><Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Please sign in to view your cart</h1>
          <Button asChild className="mt-6 rounded-full"><Link to="/auth">Sign in</Link></Button>
        </div><Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Your Cart</h1>
        {items.length === 0 ? (
          <div className="rounded-xl border bg-card p-16 text-center shadow-card">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add fresh groceries to get started.</p>
            <Button asChild className="mt-6 rounded-full"><Link to="/">Continue shopping</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-xl border bg-card p-3 shadow-card">
                  <img
                    src={i.variant_image_url || i.products?.image_url || PLACEHOLDER_IMAGE}
                    alt={i.products?.name}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-24 rounded-lg object-cover"
                    onError={(e: any) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="text-xs font-medium uppercase text-muted-foreground">{i.products?.brand}</div>
                    <Link to="/product/$slug" params={{ slug: i.products?.slug ?? "" }} className="font-semibold leading-tight hover:text-primary">{i.products?.name}</Link>
                    {i.variant_name && <div className="text-sm text-muted-foreground">{i.variant_name}</div>}
                    <div className="text-xs text-muted-foreground">{i.variant_unit ?? i.products?.weight ?? i.products?.unit}</div>
                    <div className="mt-auto flex items-end justify-between">
                      <div className="text-lg font-bold">{formatINR(Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity)}</div>
                      <div className="flex items-center gap-1 rounded-full border bg-secondary p-0.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => upd.mutate({ id: i.id, quantity: i.quantity - 1 })}><Minus className="h-3.5 w-3.5" /></Button>
                        <span className="min-w-6 text-center text-sm font-bold">{i.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" disabled={i.quantity >= (i.variant_max_qty ?? i.products?.max_qty ?? 20)} onClick={() => upd.mutate({ id: i.id, quantity: i.quantity + 1 })}><Plus className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => del.mutate(i.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border bg-card p-5 shadow-card">
                <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatINR(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span className="font-medium">{deliveryFee === 0 ? <span className="text-success">FREE</span> : formatINR(deliveryFee)}</span></div>
                  {subtotal < 499 && subtotal > 0 && (<div className="rounded-md bg-accent/10 p-2 text-xs text-accent-foreground/80">Add {formatINR(499 - subtotal)} more for free delivery</div>)}
                </div>
                <div className="my-4 border-t" />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div>
                <Button asChild size="lg" className="mt-4 w-full rounded-full"><Link to="/checkout">Proceed to Checkout</Link></Button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

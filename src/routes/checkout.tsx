import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Loader2, MapPin, Wallet } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Mana Santha" }, { name: "description", content: "Complete your order with cash on delivery." }] }),
  component: Checkout,
});

function Checkout() {
  const { user } = useAuth();
  const { data: cart } = useCart(user?.id);
  const navigate = useNavigate();
  const [slot, setSlot] = useState("today-evening");
  const [submitting, setSubmitting] = useState(false);
  const [addr, setAddr] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const items = cart ?? [];
  const subtotal = items.reduce((s, i) => s + Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 29;
  const total = subtotal + deliveryFee;

  if (!user) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Please <Link to="/auth" className="text-primary underline">sign in</Link>.</div></div>);
  if (items.length === 0) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Your cart is empty. <Link to="/" className="text-primary underline">Shop now</Link>.</div></div>);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      toast.error("Please fill all address fields"); return;
    }

    // Validate stock for all items
    setSubmitting(true);
    try {
      const { data: currentProducts } = await supabase
        .from("products")
        .select("id, stock")
        .in("id", items.map((i) => i.product_id));

      // Fetch variant stock for items that have a variant selected
      const variantIds = items.map((i) => i.variant_id).filter(Boolean);
      const { data: currentVariants } = variantIds.length > 0 ? await supabase.from("product_variants").select("id, stock").in("id", variantIds) : { data: [] };

      const insufficientStock = items.find((item) => {
        if (item.variant_id) {
          const variant = currentVariants?.find((v: any) => v.id === item.variant_id);
          return !variant || variant.stock < item.quantity;
        }
        const product = currentProducts?.find((p: any) => p.id === item.product_id);
        return !product || product.stock < item.quantity;
      });

      if (insufficientStock) {
        const productName = insufficientStock.products?.name || "One or more products";
        toast.error(`${productName} is out of stock or insufficient quantity available`);
        setSubmitting(false);
        return;
      }

      const authUser = user;
      if (!authUser) throw new Error("Unable to fetch authenticated user.");

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      const supabaseUser = authData.user;
      if (!supabaseUser?.id) throw new Error("Unable to place order: no authenticated session found.");
      if (supabaseUser.id !== authUser.id) {
        console.warn("Supabase auth user ID mismatch:", { supabaseUserId: supabaseUser.id, hookUserId: authUser.id });
      }

      const orderPayload = {
        user_id: supabaseUser.id,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        payment_method: "cod",
        payment_status: "pending",
        status: "pending",
        address_snapshot: addr as any,
        delivery_slot: slot,
      };

      console.log("Authenticated user:", supabaseUser);
      console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

      const { data: order, error: oe } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();
      console.log("Order insert error:", JSON.stringify(oe, null, 2));
      if (oe) throw oe;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        variant_id: i.variant_id ?? null,
        name: i.products?.name ?? "",
        variant_name: i.variant_name ?? null,
        image_url: i.variant_image_url ?? i.products?.image_url,
        unit: i.variant_unit ?? i.products?.unit,
        price: i.variant_price ?? i.products?.price,
        quantity: i.quantity,
        subtotal: Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity,
      }));
      const { error: ie } = await supabase.from("order_items").insert(orderItems);
      if (ie) throw ie;

      await supabase.from("cart_items").delete().eq("user_id", user.id);
      toast.success("Order placed successfully!");
      navigate({ to: "/orders" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to place order");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Checkout</h1>
        <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input required value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} /></div>
                <div><Label>Phone</Label><Input required type="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address Line 1</Label><Input required value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address Line 2 (optional)</Label><Input value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} /></div>
                <div><Label>City</Label><Input required value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></div>
                <div><Label>State</Label><Input required value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input required value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} /></div>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 font-bold">Delivery Slot</h3>
              <RadioGroup value={slot} onValueChange={setSlot} className="grid gap-2 sm:grid-cols-3">
                {[
                  { v: "today-evening", l: "Today 6–9 PM" },
                  { v: "tomorrow-morning", l: "Tomorrow 8–11 AM" },
                  { v: "tomorrow-evening", l: "Tomorrow 6–9 PM" },
                ].map((s) => (
                  <label key={s.v} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${slot === s.v ? "border-primary bg-primary/5" : ""}`}>
                    <RadioGroupItem value={s.v} /> {s.l}
                  </label>
                ))}
              </RadioGroup>
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-bold"><Wallet className="h-4 w-4 text-primary" /> Payment Method</h3>
              <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Wallet className="h-5 w-5" /></div>
                <div>
                  <div className="font-semibold">Cash on Delivery</div>
                  <div className="text-xs text-muted-foreground">Pay in cash when your order arrives.</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
              <div className="mb-3 max-h-56 space-y-2 overflow-auto text-sm">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between gap-2">
                    <span className="line-clamp-1">{i.products?.name} {i.variant_name ? <span className="text-muted-foreground">— {i.variant_name}</span> : null} <span className="text-muted-foreground">× {i.quantity}</span></span>
                    <span className="font-medium">{formatINR(Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t pt-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? <span className="text-success">FREE</span> : formatINR(deliveryFee)}</span></div>
                <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold"><span>Total</span><span>{formatINR(total)}</span></div>
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="mt-4 w-full rounded-full">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Place Order (COD)
              </Button>
            </div>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}

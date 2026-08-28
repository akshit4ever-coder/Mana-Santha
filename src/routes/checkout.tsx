import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
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
import { STORE_LAT, STORE_LNG, STORE_LOCATION, DELIVERY_RADIUS_KM } from "@/lib/config";

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
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const checkAbortRef = useRef<AbortController | null>(null);
  const storeCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Haversine distance (km)
  const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const checkDeliveryAvailability = async (addressQuery: string) => {
    if (!addressQuery || addressQuery.trim().length === 0) {
      setDeliveryAvailable(null);
      return null;
    }
    // Abort previous request
    if (checkAbortRef.current) checkAbortRef.current.abort();
    const ac = new AbortController();
    checkAbortRef.current = ac;
    setCheckingDelivery(true);
    try {
      // Ensure we have store coordinates (either configured or geocoded)
      if (!storeCoordsRef.current) {
        if (typeof STORE_LAT === "number" && typeof STORE_LNG === "number") {
          storeCoordsRef.current = { lat: STORE_LAT, lng: STORE_LNG } as any;
        } else {
          const sq = encodeURIComponent(STORE_LOCATION);
          const sres = await fetch(`https://nominatim.openstreetmap.org/search?q=${sq}&format=json&limit=1`, { signal: ac.signal });
          if (!sres.ok) throw new Error("Failed to geocode store location");
          const sbody = await sres.json();
          if (!sbody || sbody.length === 0) throw new Error("Unable to resolve store location");
          storeCoordsRef.current = { lat: Number(sbody[0].lat), lng: Number(sbody[0].lon) };
        }
      }

      // Use Nominatim to resolve full address (fall back to pincode if that's all we have)
      const q = encodeURIComponent(addressQuery);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`, { signal: ac.signal });
      if (!res.ok) throw new Error("Geocode failed");
      const body = await res.json();
      if (!body || body.length === 0) {
        setDeliveryAvailable(false);
        return false;
      }
      const lat = Number(body[0].lat);
      const lon = Number(body[0].lon);
      const { lat: storeLat, lng: storeLng } = storeCoordsRef.current as { lat: number; lng: number };
      const d = distanceKm(storeLat, storeLng, lat, lon);
      const ok = d <= DELIVERY_RADIUS_KM;
      setDeliveryAvailable(ok);
      return ok;
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.warn("Delivery check failed", err);
      setDeliveryAvailable(false);
      return false;
    } finally {
      setCheckingDelivery(false);
    }
  };

  // Use browser geolocation + reverse geocode to fill address fields
  const useCurrentLocation = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation not supported in this browser");
      return;
    }

    setCheckingDelivery(true);
    try {
                      <div><Label>State</Label><Input required value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} /></div>
                      <div><Label>Pincode</Label><Input required value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} /></div>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000 })
      );
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
      if (!res.ok) throw new Error("Failed to reverse geocode");
      const body = await res.json();
      const addrParts = body.address ?? {};
      const line1 = [addrParts.house_number, addrParts.road].filter(Boolean).join(" ") || body.display_name || "";
      const line2 = [addrParts.suburb, addrParts.neighbourhood].filter(Boolean).join(", ") || "";
      const city = addrParts.city || addrParts.town || addrParts.village || addrParts.county || "";
      const state = addrParts.state || "";
      const pincode = addrParts.postcode || "";
      setAddr((a) => ({ ...a, line1, line2, city, state, pincode }));
      const q = [line1, line2, city, state, pincode].filter(Boolean).join(" ");
      await checkDeliveryAvailability(q + ", India");
      toast.success("Location detected — please verify address details before saving or placing order");
    } catch (e: any) {
      console.warn("Geolocation/reverse geocode failed", e);
      toast.error(e?.message || "Failed to detect location");
    } finally {
      setCheckingDelivery(false);
    }
  };

  // Save currently entered address for the user (without placing order)
  const saveAddressNow = async () => {
    if (!user) {
      toast.error("Please sign in to save addresses");
      return;
    }
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      toast.error("Please fill all address fields before saving");
      return;
    }
    try {
      const { data: newAddr, error: addrErr } = await (supabase as any)
        .from("addresses")
        .insert({
          user_id: user.id,
          full_name: addr.full_name,
          phone: addr.phone,
          line1: addr.line1,
          line2: addr.line2 ?? null,
          city: addr.city,
          pincode: addr.pincode,
          is_default: false,
        })
        .select()
        .single();
      if (addrErr) throw addrErr;
      setSavedAddresses((s) => [newAddr, ...(s ?? [])]);
      setSelectedAddressId(newAddr.id);
      toast.success("Address saved");
    } catch (e: any) {
      console.warn("Failed to save address", e);
      toast.error(e?.message || "Failed to save address");
    }
  };

  // Run check when address fields change (debounced)
  useEffect(() => {
    // Prefer full address (line1 present); otherwise try city + pincode if both provided
    let qParts: string[] = [];
    if (addr.line1 && addr.line1.trim().length > 0) {
      qParts = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean);
    } else if (addr.city && addr.pincode) {
      qParts = [addr.city, addr.pincode].filter(Boolean);
    }

    if (qParts.length === 0) {
      setDeliveryAvailable(null);
      return;
    }
    const qStr = `${qParts.join(" ")}, India`;
    const id = setTimeout(() => { checkDeliveryAvailability(qStr); }, 700);
    return () => clearTimeout(id);
  }, [addr.line1, addr.line2, addr.city, addr.state, addr.pincode]);

  // Load saved addresses for authenticated user
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const { data } = await (supabase as any)
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (!mounted) return;
        setSavedAddresses(data ?? []);
      } catch (e) {
        console.warn("Failed to load saved addresses", e);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const items: any[] = (cart ?? []) as any[];
  const subtotal = items.reduce((s, i) => s + Number(i.variant_price ?? i.products?.price ?? 0) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 29;
  const total = subtotal + deliveryFee;

  if (!user) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Please <Link to="/auth" className="text-primary underline">sign in</Link>.</div></div>);
  if (items.length === 0) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Your cart is empty. <Link to="/" className="text-primary underline">Shop now</Link>.</div></div>);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addr.full_name || !addr.phone || !addr.line1 || !addr.city || !addr.pincode) {
      toast.error("Please fill all address fields"); return;
    }
    // Ensure latest availability check (geocode full address) before placing order
    const qParts = [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean);
    const qStr = `${qParts.join(" ")}, India`;
    setCheckingDelivery(true);
    const avail = await checkDeliveryAvailability(qStr);
    if (avail === false) {
      toast.error("Service unavailable at this location (outside delivery radius)");
      setCheckingDelivery(false);
      return;
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
      const { data: currentVariants } = variantIds.length > 0 ? await (supabase as any).from("product_variants").select("id, stock").in("id", variantIds) : { data: [] };

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

      // Ensure address is saved in `addresses` table and attach its id to the order
      let addressId = selectedAddressId;
      if (!addressId) {
        // Try to find an identical saved address
        const found = savedAddresses.find((s) => s.full_name === addr.full_name && s.phone === addr.phone && s.line1 === addr.line1 && (s.line2 ?? "") === (addr.line2 ?? "") && s.city === addr.city && s.state === addr.state && s.pincode === addr.pincode);
        if (found) {
          addressId = found.id;
          setSelectedAddressId(addressId);
        } else {
          const { data: newAddr, error: addrErr } = await (supabase as any)
            .from("addresses")
            .insert({
                user_id: supabaseUser.id,
                full_name: addr.full_name,
                phone: addr.phone,
                line1: addr.line1,
                line2: addr.line2 ?? null,
                city: addr.city,
                pincode: addr.pincode,
                is_default: false,
              })
            .select()
            .single();
          if (addrErr) throw addrErr;
          addressId = newAddr.id;
          setSavedAddresses((s) => [newAddr, ...s]);
          setSelectedAddressId(addressId);
        }
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
        address_id: addressId ?? null,
        delivery_slot: slot,
      };

      console.log("Authenticated user:", supabaseUser);
      console.log("Order payload:", JSON.stringify(orderPayload, null, 2));

      const { data: order, error: oe } = await (supabase as any)
        .from("orders")
        .insert(orderPayload as any)
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
      const { error: ie } = await (supabase as any).from("order_items").insert(orderItems as any[]);
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
            {/* Saved addresses selector */}
            {savedAddresses.length > 0 && (
              <section className="rounded-xl border bg-card p-4 shadow-card">
                <h3 className="mb-3 font-bold">Saved addresses</h3>
                <div className="grid gap-3">
                  {savedAddresses.map((a) => (
                    <div key={a.id} className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${selectedAddressId === a.id ? "border-primary bg-primary/5" : "hover:bg-secondary"}`}>
                      <div>
                                        <div className="font-medium">{a.full_name} <span className="text-muted-foreground">• {a.phone}</span></div>
                                                        <div className="text-sm text-muted-foreground">{a.line1}{a.line2 ? ", " + a.line2 : ""}, {a.city}{a.state ? `, ${a.state}` : ""} — {a.pincode}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button type="button" className="text-sm text-primary underline" onClick={() => {
                                          setAddr({
                                            full_name: a.full_name,
                                            phone: a.phone,
                                            line1: a.line1,
                                            line2: a.line2 ?? "",
                                            city: a.city,
                                            state: a.state ?? "",
                                            pincode: a.pincode,
                                          });
                          setSelectedAddressId(a.id);
                          const q = [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(" ");
                          checkDeliveryAvailability(q + ", India");
                        }}>Use</button>
                        <button type="button" className="text-sm text-destructive" onClick={async () => {
                          try {
                            const { error } = await (supabase as any).from("addresses").delete().eq("id", a.id).eq("user_id", user.id);
                            if (error) throw error;
                            setSavedAddresses((s) => s.filter((x) => x.id !== a.id));
                            if (selectedAddressId === a.id) {
                              setSelectedAddressId(null);
                              setAddr({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
                            }
                            toast.success("Address removed");
                          } catch (e: any) {
                            toast.error(e.message || "Failed to remove address");
                          }
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            <section className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={useCurrentLocation} className="text-sm text-primary underline" disabled={checkingDelivery}>
                    {checkingDelivery ? "Detecting…" : "Use my current location"}
                  </button>
                  <button type="button" onClick={saveAddressNow} className="ml-2 rounded-full border px-3 py-1 text-sm" disabled={checkingDelivery}>
                    Save address
                  </button>
                </div>
              </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input required value={addr.full_name} onChange={(e) => setAddr({ ...addr, full_name: e.target.value })} /></div>
                <div><Label>Phone</Label><Input required type="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address Line 1</Label><Input required value={addr.line1} onChange={(e) => setAddr({ ...addr, line1: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Address Line 2 (optional)</Label><Input value={addr.line2} onChange={(e) => setAddr({ ...addr, line2: e.target.value })} /></div>
                <div><Label>City</Label><Input required value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} /></div>
                <div><Label>Pincode</Label><Input required value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} /></div>
                {deliveryAvailable === false && (
                  <div className="sm:col-span-2 text-sm text-destructive">Service unavailable at this location (outside {DELIVERY_RADIUS_KM}km delivery radius).</div>
                )}
                {deliveryAvailable === true && (
                  <div className="sm:col-span-2 text-sm text-success">Delivery available in your area.</div>
                )}
                {deliveryAvailable === null && checkingDelivery && (
                  <div className="sm:col-span-2 text-sm text-muted-foreground">Checking delivery availability…</div>
                )}
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
              <Button type="submit" size="lg" disabled={submitting || deliveryAvailable === false || checkingDelivery} className="mt-4 w-full rounded-full">
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

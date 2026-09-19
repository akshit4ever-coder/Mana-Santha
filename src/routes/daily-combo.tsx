import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Button } from "@/components/UI/button";
import { useAuth } from "@/lib/auth";
import { getActiveCombo, useAddComboToCart } from "@/lib/queries";
import { getComboItemDisplayMeta } from "@/lib/combo-item-display";

export const Route = createFileRoute("/daily-combo")({
  head: () => ({
    meta: [
      { title: "నేటి కాంబో — Mana Santa" },
      { name: "description", content: "View today’s Mana Santa combo offer and add it to your cart." },
    ],
  }),
  component: DailyComboPage,
});

function DailyComboPage() {
  const { user } = useAuth();
  const { data: combo, isLoading } = useQuery({
    queryKey: ["active-combo-page"],
    queryFn: async () => await getActiveCombo(),
  });
  const addCombo = useAddComboToCart(user?.id);
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] text-[#17251b]">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="rounded-2xl border border-[#dfead8] bg-white p-8 text-center text-[#173522]">నేటి కాంబో లోడ్ అవుతోంది…</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-[#faf9f5] text-[#17251b]">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="rounded-2xl border border-dashed border-[#dfead8] bg-[#f5faf5] p-8 text-center">
            <h1 className="text-2xl font-black text-[#173522]">నేటి కాంబో</h1>
            <p className="mt-3 text-[#5c695f]">ప్రస్తుతం ఏ కాంబో అందుబాటులో లేదు.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = combo.offer_price ? `₹${combo.offer_price}` : `₹${combo.price}`;
  const mrp = combo.offer_price ? `₹${combo.price}` : null;
  const savings = combo.offer_price ? Math.max(0, Number(combo.price ?? 0) - Number(combo.offer_price ?? 0)) : 0;

  return (
    <>
      <div className="min-h-screen bg-[#faf9f5] text-[#17251b]">
        <Header />

        <main className="container mx-auto px-4 py-6 md:py-10">
          <div className="rounded-[30px] border border-[#dfead8] bg-[#f5faf4] p-4 shadow-[0_20px_40px_rgba(16,185,129,0.08)] md:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#176B3A] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                నేటి కాంబో
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
              <div className="overflow-hidden rounded-[26px] border border-[#dfead8] bg-white p-2 shadow-sm">
                <img
                  src={combo.image_url || "/src/assets/combos/daily_combo_poster.png"}
                  alt={combo.name}
                  className="aspect-[4/3] w-full rounded-[18px] object-cover"
                />
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <div className="mb-2 inline-flex items-center rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#176B3A]">
                    పరిమిత ఆఫర్
                  </div>
                  <h1 className="text-3xl font-black text-[#114e2a] md:text-5xl">{combo.name}</h1>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-4xl font-black text-[#176B3A] md:text-5xl">{price}</span>
                  {mrp && <span className="text-xl font-medium text-[#697669] line-through">{mrp}</span>}
                  {savings > 0 && <span className="rounded-full bg-[#fff3cd] px-2.5 py-1 text-xs font-bold text-[#b45309]">{savings} తగ్గింపు</span>}
                </div>

                <div className="rounded-2xl border border-[#dfead8] bg-white px-4 py-3 text-base font-medium text-[#24452f]">
                  {combo.description || "ఈరోజు ప్రత్యేక ఆఫర్"}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => {
                      addCombo.mutate(
                        { comboId: combo.id, quantity: 1 },
                        { onSuccess: () => setAddedToCart(true) },
                      );
                    }}
                    className="flex-1 rounded-full bg-[#176B3A] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-[#145a32]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      {addedToCart ? "కార్ట్‌లో జోడించబడింది" : "కార్ట్‌కు జోడించండి"}
                    </span>
                  </Button>
                </div>

                <div className="rounded-2xl border border-[#dfead8] bg-white p-4">
                  <div className="mb-3 text-lg font-bold text-[#173522]">కలిపిన వస్తువులు</div>
                  <div className="space-y-2">
                    {combo.combo_items?.map((item: any, index: number) => {
                      const meta = getComboItemDisplayMeta(item);

                      return (
                        <div key={item.id || `${combo.id}-${index}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#edf3ea] bg-[#f8fbf7] px-3 py-2">
                          <div className="font-medium text-[#173522]">{meta.productName}</div>
                          <div className="text-sm font-medium text-[#56665d]">
                            {meta.quantityLabel}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

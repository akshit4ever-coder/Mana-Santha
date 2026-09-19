import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { useAuth } from "@/lib/auth";
import { useAddComboToCart, getActiveCombo } from "@/lib/queries";
import { getComboItemDisplayMeta } from "@/lib/combo-item-display";

export function ComboOffer() {
  const { data: combo, isLoading } = useQuery({
    queryKey: ["active-combo"],
    queryFn: async () => await getActiveCombo(),
  });
  const { user } = useAuth();
  const addCombo = useAddComboToCart(user?.id);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const itemCount = useMemo(() => Number(combo?.combo_items?.length ?? 0), [combo]);

  if (isLoading) {
    return (
      <section className="mt-5 rounded-[24px] border border-[#dfead8] bg-[#f5fbf3] p-4 shadow-sm">
        <div className="text-center text-sm font-semibold text-[#1a5b36]">నేటి కాంబో</div>
        <div className="mt-2 text-center text-sm text-[#5f6e62]">క్రియాశీల కాంబో లోడ్ అవుతోంది…</div>
      </section>
    );
  }

  if (!combo) {
    if (import.meta.env.DEV) {
      return (
        <section className="mt-5 rounded-[24px] border border-dashed border-[#cfe1d2] bg-[#f8faf7] p-6 text-center shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#1f7a43]">నేటి కాంబో</div>
          <div className="mt-2 text-lg font-bold text-[#163d2a]">ప్రస్తుతం ఏ కాంబో అందుబాటులో లేదు.</div>
        </section>
      );
    }
    return null;
  }

  const priceText = combo.offer_price ? `₹${combo.offer_price}` : `₹${combo.price}`;
  const mrpText = combo.offer_price ? `₹${combo.price}` : null;
  const savings = combo.offer_price ? Math.max(0, Number(combo.price ?? 0) - Number(combo.offer_price ?? 0)) : 0;

  return (
    <>
      <section className="mt-5 relative rounded-[24px] border border-[#dfead8] bg-[#f4faf3] p-3 shadow-[0_12px_28px_rgba(16,185,129,0.10)] md:p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#176B3A] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
            నేటి కాంబో
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-[#dfead8] bg-[#f8f9f3] md:w-52">
            <img
              src={combo.image_url || "/src/assets/combos/daily_combo_poster.png"}
              alt={combo.name}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h3 className="text-[18px] font-black text-[#114e2a] md:text-[26px]">{combo.name}</h3>
              <p className="mt-1 text-sm text-[#56665d]">{itemCount} వస్తువులు కలిపి</p>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <span className="text-[28px] font-black text-[#176B3A] md:text-[34px]">{priceText}</span>
              {mrpText && <span className="text-base font-medium text-[#697669] line-through">{mrpText}</span>}
              {savings > 0 && <span className="rounded-full bg-[#fff3cd] px-2 py-1 text-[11px] font-bold text-[#b45309]">{savings} తగ్గింపు</span>}
            </div>

            <div className="rounded-2xl border border-[#dfead8] bg-white/80 px-3 py-2 text-sm font-medium text-[#1d3a2d]">
              {combo.description || "ఈరోజు ప్రత్యేక ఆఫర్"}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() => {
                  addCombo.mutate(
                    { comboId: combo.id, quantity: 1 },
                    {
                      onSuccess: () => setAddedToCart(true),
                    },
                  );
                }}
                disabled={combo.status !== "active" || addCombo.isLoading}
                className="flex-1 rounded-full bg-[#176B3A] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#145a32] sm:flex-none"
              >
                {addedToCart ? "కార్ట్‌లో జోడించబడింది" : "కార్ట్‌కు జోడించండి"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDetailsOpen(true)}
                className="rounded-full border-[#cfe1d2] bg-white px-4 py-3 text-sm font-bold text-[#176B3A] hover:bg-[#f3faf5]"
              >
                వివరాలు చూడండి
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-left text-2xl font-black text-[#114e2a]">{combo.name}</DialogTitle>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsDetailsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dfead8] bg-white text-[#173522]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <DialogDescription className="text-left text-sm text-[#56665d]">ఇందులో ఇవి ఉన్నాయి</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            {combo.combo_items?.map((item: any, index: number) => {
              const meta = getComboItemDisplayMeta(item);
              return (
                <div key={item.id || `${combo.id}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#edf3ea] bg-[#f8fbf7] px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[#173522]">{meta.productName}</div>
                  </div>
                  <div className="shrink-0 text-right text-sm font-medium text-[#4d6155]">
                    {meta.quantityLabel}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="mt-4 sm:justify-between">
            <div className="text-sm font-semibold text-[#176B3A]">
              {itemCount} వస్తువులు కలిపి
            </div>
            <Button
              type="button"
              onClick={() => {
                addCombo.mutate(
                  { comboId: combo.id, quantity: 1 },
                  {
                    onSuccess: () => {
                      setAddedToCart(true);
                      setIsDetailsOpen(false);
                    },
                  },
                );
              }}
              disabled={combo.status !== "active" || addCombo.isLoading}
              className="rounded-full bg-[#176B3A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#145a32]"
            >
              {addedToCart ? "కార్ట్‌లో జోడించబడింది" : "కార్ట్‌కు జోడించండి"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ComboOffer;

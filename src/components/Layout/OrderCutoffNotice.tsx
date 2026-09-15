import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getOrderCutoffStatus } from "@/lib/delivery-cutoff";

const STORAGE_KEY = "mana_santa_order_cutoff_notice_date";

function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function OrderCutoffNotice() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissedDate = localStorage.getItem(STORAGE_KEY);
    const todayKey = getTodayKey();

    if (dismissedDate !== todayKey) {
      setOpen(true);
    }
  }, []);

  const status = useMemo(() => getOrderCutoffStatus(), []);

  const handleClose = () => {
    const todayKey = getTodayKey();
    localStorage.setItem(STORAGE_KEY, todayKey);
    setOpen(false);
  };

  if (!open) return null;

  const title = status.isAfterCutoff
    ? "Today's Order Cutoff Has Passed"
    : "Order Before 7:30 PM";

  const description = status.isAfterCutoff
    ? "Orders placed now will be delivered tomorrow. You can still place your order normally."
    : "Place your order before 7:30 PM for today's delivery. Orders placed after 7:30 PM will be delivered tomorrow.";

  return (
    <Dialog open={open} onOpenChange={(next) => {
      if (!next) handleClose();
    }}>
      <DialogContent className="max-w-md rounded-2xl border-0 bg-white p-0 shadow-2xl sm:rounded-2xl">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <button
              type="button"
              aria-label="Close cutoff notice"
              className="rounded-full p-2 text-muted-foreground transition hover:bg-white hover:text-foreground"
              onClick={handleClose}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-bold text-emerald-900">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-slate-700">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-white/80 p-3 text-sm text-slate-700">
            <p className="font-medium text-emerald-900">Delivery timing</p>
            <p className="mt-1">
              {status.isAfterCutoff
                ? "Orders placed now will be delivered tomorrow."
                : "Orders placed before 7:30 PM are eligible for today’s delivery."}
            </p>
          </div>

          <div className="mt-5 flex justify-end">
            <Button onClick={handleClose} className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700">
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

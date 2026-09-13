import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function FestivalOfferBanner({
  targetRoute = "/",
}: {
  targetRoute?: string;
}) {
  return (
    <section className="relative mt-5 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#087d3c] via-[#15964a] to-[#f2b536] px-6 py-6 shadow-[0_12px_28px_rgba(20,95,44,0.12)] sm:px-8">
      <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 right-40 h-40 w-40 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-100">
            Ganesh Utsav
          </p>

          <h3 className="mt-1 text-2xl font-black sm:text-3xl">Special Offer</h3>

          <p className="mt-1 max-w-2xl text-sm text-white/90 sm:text-base">
            Special prices on sweets, pooja items & more — bring home the blessings with Mana Santa.
          </p>
        </div>

        <Link
          to={targetRoute as any}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#08733a] shadow-md transition hover:-translate-y-0.5"
        >
          Shop Now
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

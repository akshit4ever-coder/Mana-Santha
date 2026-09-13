import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { ProductCard } from "@/components/products/ProductCard";

export function FestivalProducts({
  products,
}: {
  products: any[] | undefined;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const visibleProducts = (products ?? []).slice(0, 12);

  const scroll = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * 500,
      behavior: "smooth",
    });
  };

  if (visibleProducts.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#dfe7d5] bg-white text-sm font-medium text-[#5d6d5f]">
        Festival products will be available soon.
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous products"
        className="absolute left-[-10px] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 lg:flex"
      >
        <ChevronLeft className="h-5 w-5 text-[#176b38]" />
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next products"
        className="absolute right-[-10px] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 lg:flex"
      >
        <ChevronRight className="h-5 w-5 text-[#176b38]" />
      </button>

      <div
        ref={trackRef}
        className="scrollbar-none flex h-full gap-3 overflow-x-auto pb-3 sm:gap-4"
      >
        {visibleProducts.map((product: any) => (
          <div
            key={product.id}
            className="h-full w-[185px] shrink-0 sm:w-[205px] lg:w-[220px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

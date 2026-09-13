import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export function FestivalCategorySlider({
  categories,
}: {
  categories: any[];
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: number) => {
    trackRef.current?.scrollBy({
      left: direction * 260,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous categories"
        className="absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 md:flex"
      >
        <ChevronLeft className="h-5 w-5 text-[#145c32]" />
      </button>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next categories"
        className="absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 md:flex"
      >
        <ChevronRight className="h-5 w-5 text-[#145c32]" />
      </button>

      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x items-stretch gap-3 overflow-x-auto pb-2 sm:gap-4"
      >
        {categories.map((category: any) => (
          <Link
            key={category.id ?? category.categorySlug}
            to="/category/$slug"
            params={{
              slug: category.categorySlug,
            }}
            className="group flex h-full w-[150px] shrink-0 snap-start flex-col overflow-hidden rounded-[18px] bg-white shadow-[0_5px_18px_rgba(34,73,44,0.08)] ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(34,73,44,0.14)] sm:w-[175px] lg:w-[190px]"
          >
            <div className="aspect-[1/0.88] overflow-hidden bg-[#f3f4ef]">
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='350'%3E%3Crect width='400' height='350' fill='%23f2f4eb'/%3E%3Ccircle cx='200' cy='170' r='90' fill='%23d9ead3'/%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="flex flex-1 flex-col justify-center px-3 py-3 text-center">
              <div className="line-clamp-2 min-h-[40px] text-sm font-bold leading-tight text-[#1c2c21]">
                {category.name}
              </div>

              <div className="mt-1 line-clamp-1 text-[11px] text-[#7a847d]">
                {category.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

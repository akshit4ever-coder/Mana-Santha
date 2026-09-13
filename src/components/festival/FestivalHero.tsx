import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type FestivalHeroProps = {
  title: string;
  subtitle: string;
  bannerImage: string;
  badge?: string;
  ctaLabel?: string;
  ctaRoute?: string;
};

export function FestivalHero({
  title,
  subtitle,
  bannerImage,
  badge,
  ctaLabel = "Shop Festival Essentials",
  ctaRoute = "/",
}: FestivalHeroProps) {
  return (
    <section className="relative mx-3 mt-3 max-w-[1400px] overflow-hidden rounded-[20px] shadow-sm sm:mx-6 md:mx-0 md:rounded-[24px]">
      <div
        className="relative w-full overflow-hidden bg-[#f5ead3] [aspect-ratio:3/1] sm:[aspect-ratio:16/6] md:[aspect-ratio:16/6]"
        style={{ maxWidth: '100%' }}
      >
        <img
          src={bannerImage}
          alt={badge ?? title}
          className="block h-full w-full object-contain sm:object-cover object-center"
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 md:bottom-[8%] md:left-[5%]">
          <Link
            to={ctaRoute as any}
            aria-label={ctaLabel}
            className="inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-[#F97316] px-2.5 py-1.5 text-[10px] font-semibold text-white shadow-[0_4px_12px_rgba(249,115,22,0.15)] transition hover:bg-[#df5c17] sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
            style={{ minHeight: 32 }}
          >
            <span className="sm:hidden">Festival Essentials</span>
            <span className="hidden sm:inline">{ctaLabel}</span>
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type FestivalHeroProps = {
  title: string;
  subtitle: string;
  bannerImage: string;
  mobileBannerImage?: string;
  badge?: string;
  ctaLabel?: string;
  ctaRoute?: string;
};

export function FestivalHero({
  title,
  subtitle,
  bannerImage,
  mobileBannerImage,
  badge,
  ctaLabel = "Shop Festival Essentials",
  ctaRoute = "/",
}: FestivalHeroProps) {
  return (
    <section
      className="
        relative mt-3
        w-full max-w-none
        mx-0
        overflow-hidden
        shadow-sm
        sm:mx-auto sm:max-w-[1400px] sm:rounded-[20px]
        md:rounded-[24px]
      "
    >
      <div className="relative w-full overflow-hidden bg-[#f5ead3]">
        <picture className="block w-full">
          {mobileBannerImage && (
            <source media="(max-width: 767px)" srcSet={mobileBannerImage} />
          )}

          <img
            src={bannerImage}
            alt={badge ?? title}
            className="
              block
              w-full
              max-w-full
              h-auto
              object-contain
              rounded-[7px]

              sm:aspect-[16/6]
              sm:h-auto
              sm:object-cover
              sm:rounded-[20px]

              md:rounded-[24px]
            "
          />
        </picture>

        {/* CTA */}
        <div
          className="
            absolute
            bottom-3 left-3

            sm:bottom-5 sm:left-6
            md:bottom-[8%] md:left-[5%]
          "
        >
          <Link
            to={ctaRoute as any}
            aria-label={ctaLabel}
            className="
              inline-flex
              items-center
              gap-1
              whitespace-nowrap
              rounded-full
              bg-[#F97316]

              px-2.5
              py-1.5
              text-[10px]
              leading-none
              font-semibold
              text-white

              shadow-[0_4px_12px_rgba(249,115,22,0.15)]

              transition
              hover:bg-[#df5c17]

              sm:gap-1.5
              sm:px-3
              sm:py-2
              sm:text-xs
            "
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

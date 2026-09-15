import heroBanner from "@/assets/festival/hero_banner.png";
import festivalCategoryPlaceholder from "@/assets/festival/festival-category-placeholder.svg";

export type FestivalCategory = {
  id?: string;
  name: string;
  image: string;
  categorySlug: string;
  description?: string;
};

export const currentFestival = {
  name: "Mana Santa",

  title: "Mana Santa",

  bannerImage: heroBanner,

  categoryFallbackImage: festivalCategoryPlaceholder,
};

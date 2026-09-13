import ganeshBanner from "@/assets/festival/ganesh_image.jpeg";
import festivalCategoryPlaceholder from "@/assets/festival/festival-category-placeholder.svg";

export type FestivalCategory = {
  id?: string;
  name: string;
  image: string;
  categorySlug: string;
  description?: string;
};

export const currentFestival = {
  name: "Ganesh Utsav",

  title: "Happy Ganesh Utsav",

  bannerImage: ganeshBanner,

  categoryFallbackImage: festivalCategoryPlaceholder,
};

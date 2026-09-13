import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Truck,
  ShieldCheck,
  Tag,
  HeartHandshake,
  CreditCard,
  ArrowRight,
} from "lucide-react";

import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useCategories, useProducts, useShopFreshProducts } from "@/lib/queries";

import { FestivalHero } from "@/components/festival/FestivalHero";
import GaneshImage from "@/assets/festival/ganesh_image.png";
import GaneshMobile from "@/assets/festival/ganesh_mobile.png";
import { TrustFeatures } from "@/components/festival/TrustFeatures";
import { FestivalCategorySlider } from "@/components/festival/FestivalCategorySlider";
import { FestivalOfferBanner } from "@/components/festival/FestivalOfferBanner";
import { FestivalProducts } from "@/components/festival/FestivalProducts";

import { currentFestival } from "@/lib/festival-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Mana Santa — Fresh Groceries Delivered to Your Doorstep",
      },
      {
        name: "description",
        content:
          "Order fresh fruits, vegetables, dairy, atta, dal, oil, snacks and everyday kirana essentials online with fast home delivery.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: categories = [] } = useCategories();

  /**
   * Normalize category name for matching.
   */
  const normalize = (value: unknown) =>
    String(value ?? "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const { data: allProducts = [], isLoading: productsLoading } = useProducts({
    limit: 60,
  });

  const { data: shopFreshProducts = [], isLoading: shopFreshLoading } = useShopFreshProducts();

  /**
   * Find an existing category from Supabase.
   *
   * We NEVER create fake categories.
   */
  const findCategory = (...keywords: string[]) => {
    const normalizedKeywords = keywords.map(normalize);

    return categories.find((category: any) => {
      const name = normalize(category.name);
      const slug = normalize(category.slug);

      return normalizedKeywords.some(
        (keyword) => name.includes(keyword) || slug.includes(keyword)
      );
    });
  };

  const findSubcategory = (category: any, ...keywords: string[]) => {
    if (!category?.subcategories?.length) return null;

    const normalizedKeywords = keywords.map(normalize);

    return category.subcategories.find((subcategory: any) => {
      const name = normalize(subcategory.name);
      const slug = normalize(subcategory.slug);

      return normalizedKeywords.some(
        (keyword) => name.includes(keyword) || slug.includes(keyword)
      );
    }) ?? null;
  };

  const findProductImage = (categoryName: string, subcategoryName?: string) => {
    const targetCategory = normalize(categoryName);
    const targetSubcategory = normalize(subcategoryName ?? "");

    const product = allProducts.find((product: any) => {
      const productCategory = normalize(product.categories?.name ?? "");
      const productSubcategory = normalize(product.subcategories?.name ?? "");
      const productName = normalize(product.name ?? "");

      if (!targetCategory) return false;

      return (
        productCategory.includes(targetCategory) ||
        productSubcategory.includes(targetCategory) ||
        productName.includes(targetCategory) ||
        (targetSubcategory && (
          productCategory.includes(targetSubcategory) ||
          productSubcategory.includes(targetSubcategory) ||
          productName.includes(targetSubcategory)
        ))
      );
    });

    return (
      product?.image_url ||
      product?.product_variants?.find((variant: any) => variant.image_url)?.image_url ||
      product?.product_variants?.[0]?.image_url ||
      null
    );
  };

  /**
   * Festival category order.
   *
   * These are only displayed when the category actually exists
   * in your Supabase database.
   */
  const categoryDefinitions = [
    {
      keywords: ["pooja", "puja"],
      fallbackName: "Pooja Essentials",
      description: "Everything for your pooja",
    },
    {
      keywords: ["sweet", "sweets"],
      fallbackName: "Sweets",
      description: "Traditional festive treats",
    },
    {
      keywords: ["dry fruit", "dry fruits", "nuts"],
      fallbackName: "Dry Fruits",
      description: "Healthy festive gifting",
    },
    {
      keywords: ["flower", "flowers"],
      fallbackName: "Flowers",
      description: "Fresh flowers for pooja",
    },
    {
      keywords: ["fruit", "fruits"],
      fallbackName: "Fruits",
      description: "Fresh festive fruits",
    },
    {
      keywords: ["coconut"],
      fallbackName: "Coconut",
      description: "Fresh coconut",
    },
    {
      keywords: ["incense", "camphor", "agarbatti"],
      fallbackName: "Incense & Camphor",
      description: "For peaceful rituals",
    },
    {
      keywords: ["oil", "edible oil"],
      fallbackName: "Edible Oils",
      description: "Everyday essentials",
    },
    {
      keywords: ["rice"],
      fallbackName: "Rice",
      description: "Quality rice varieties",
    },
  ];

  const festivalCategories = categoryDefinitions
    .map((definition) => {
      const category = findCategory(...definition.keywords);

      if (!category) return null;

      return {
        id: category.id,
        name: definition.fallbackName || category.name,
        description: definition.description,
        categorySlug: category.slug,

        image:
          category.image_url ||
          category.image ||
          category.banner_url ||
          currentFestival.categoryFallbackImage,
      };
    })
    .filter(Boolean) as any[];

  const milkCategory = findCategory("milk & milk products", "milk", "milk products");
  const milkSubcategoryDefinitions = [
    { keywords: ["ghee"], fallbackName: "Ghee", description: "Pure and rich ghee" },
    { keywords: ["curd"], fallbackName: "Curd", description: "Fresh curd and dahi" },
  ];

  const milkSubcategoryCards = (milkCategory ? milkSubcategoryDefinitions : [])
    .map((definition) => {
      const subcategory = findSubcategory(milkCategory, ...definition.keywords);
      if (!subcategory) return null;

      const productImage = findProductImage(definition.fallbackName, subcategory.name);

      return {
        id: subcategory.id,
        name: definition.fallbackName || subcategory.name,
        description: definition.description,
        categorySlug: milkCategory.slug,
        image:
          productImage ||
          subcategory.image_url ||
          milkCategory.image_url ||
          milkCategory.image ||
          milkCategory.banner_url ||
          currentFestival.categoryFallbackImage,
      };
    })
    .filter((entry: any) => {
      const normalizedEntryKey = String(entry?.id ?? entry?.categorySlug ?? "");
      return !festivalCategories.some((festivalCategory: any) => {
        const existingKey = String(festivalCategory?.id ?? festivalCategory?.categorySlug ?? "");
        return existingKey === normalizedEntryKey;
      });
    }) as any[];

  festivalCategories.push(...milkSubcategoryCards);

  /**
   * Shop Fresh: real products from fresh/daily grocery categories only.
   * Deterministic, category-diverse, and not based on updated_at / latest insertion order.
   */
  /**
   * Shop Fresh section uses the actual Supabase category data.
   * This keeps it distinct from Handpicked and avoids fallback product noise.
   */
  const shopFreshIds = new Set(shopFreshProducts.map((product: any) => product.id));

  /**
   * Handpicked products should be a broader daily-grocery mix, intentionally distinct from Shop Fresh.
   */
  const handpickedProducts = (() => {
    const allowedCategoryKeywords = [
      "fruit",
      "vegetable",
      "rice",
      "atta",
      "flour",
      "dal",
      "pulse",
      "oil",
      "milk",
      "dairy",
      "egg",
      "spice",
      "masala",
      "snack",
      "biscuit",
      "beverage",
      "breakfast",
      "dry fruit",
      "dry fruits",
      "cereal",
      "grain",
      "tea",
      "coffee",
      "ghee",
      "butter",
      "curd",
      "yogurt",
      "sugar",
      "salt",
      "household",
      "cleaning",
      "soap",
      "detergent",
      "toilet",
      "personal care",
      "shampoo",
      "cream",
      "toothpaste",
      "laundry",
      "coconut",
    ];

    const excludedKeywords = [
      "book",
      "books",
      "notebook",
      "school",
      "stationery",
      "pen",
      "pencil",
      "copy",
      "register",
      "graph",
      "paper",
      "diary",
      "marker",
      "sharpener",
      "scale",
      "eraser",
      "exam",
      "textbook",
    ];

    const candidates = allProducts.filter((product: any) => {
      if (product.is_active === false) return false;
      if (product.deleted_at || product.is_deleted) return false;
      if (shopFreshIds.has(product.id)) return false;

      const categoryName = normalize(product.categories?.name);
      const subcategoryName = normalize(product.subcategories?.name);
      const productName = normalize(product.name);
      const brand = normalize(product.brand);
      const combined = `${categoryName} ${subcategoryName} ${productName} ${brand}`;

      if (!combined) return false;
      if (excludedKeywords.some((keyword) => combined.includes(keyword))) return false;

      return allowedCategoryKeywords.some((keyword) => combined.includes(keyword));
    });

    const grouped = new Map<string, any[]>();
    candidates.forEach((product: any) => {
      const categoryKey = normalize(product.categories?.name || product.subcategories?.name || "other");
      if (!grouped.has(categoryKey)) grouped.set(categoryKey, []);
      grouped.get(categoryKey)!.push(product);
    });

    const selected: any[] = [];
    const seen = new Set<string>();
    const orderedCategories = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

    orderedCategories.forEach((categoryKey) => {
      const items = grouped
        .get(categoryKey)!
        .slice()
        .sort((a: any, b: any) =>
          String(a.name ?? "").localeCompare(String(b.name ?? ""))
        );

      items.slice(0, 2).forEach((item) => {
        if (selected.length >= 10) return;
        if (!seen.has(item.id)) {
          seen.add(item.id);
          selected.push(item);
        }
      });
    });

    if (selected.length < 6) {
      const remaining = candidates
        .filter((product: any) => !seen.has(product.id))
        .sort((a: any, b: any) =>
          `${normalize(a.categories?.name || "")} ${normalize(a.name || "")}`.localeCompare(
            `${normalize(b.categories?.name || "")} ${normalize(b.name || "")}`
          )
        );

      remaining.slice(0, 10 - selected.length).forEach((product: any) => {
        if (selected.length >= 10) return;
        selected.push(product);
      });
    }

    return selected.slice(0, 10);
  })();

  /**
   * Use actual grocery category pages as the primary CTA destinations.
   * We avoid forcing the homepage to only point at a Pooja category.
   */
  const poojaCategory = findCategory("pooja", "puja");
  const kiranaCategory = findCategory("kirana", "essentials", "household", "grocery");
  const groceryCategory = findCategory("rice", "atta", "dal", "oil", "spice", "dairy");

  const heroRoute =
    (poojaCategory ? `/category/${poojaCategory.slug}` : "") ||
    (kiranaCategory ? `/category/${kiranaCategory.slug}` : "") ||
    (groceryCategory ? `/category/${groceryCategory.slug}` : "") ||
    "/kirana-essentials";

  const categoryViewAllRoute = poojaCategory
    ? `/category/${poojaCategory.slug}`
    : kiranaCategory
    ? `/category/${kiranaCategory.slug}`
    : "/kirana-essentials";

  const benefits = [
    {
      icon: Truck,
      title: "Same Day Delivery",
      subtitle: "Across Your Area",
    },
    {
      icon: ShieldCheck,
      title: "Fresh & Quality",
      subtitle: "Products",
    },
    {
      icon: Tag,
      title: "Best Prices",
      subtitle: "Everyday",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      subtitle: "COD & UPI",
    },
    {
      icon: HeartHandshake,
      title: "Trusted by",
      subtitle: "Local Families",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f5] text-[#17251b]">
      <Header />

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-10 sm:px-5 lg:px-6">
        <FestivalHero
          title="Happy Ganesh Utsav"
          subtitle="Celebrate new beginnings with fresh essentials from Mana Santa"
          bannerImage={GaneshImage}
          mobileBannerImage={GaneshMobile}
          ctaRoute={heroRoute}
          ctaLabel="Shop Festival Essentials"
          badge="GANESH UTSAV"
        />

        <TrustFeatures />

        {/* Festival Needs */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-4 px-1">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[#155d32] sm:text-[30px]">
                Shop by Festival Needs
              </h2>
              <p className="mt-1 text-sm text-[#657267]">Everything you need for your celebrations</p>
            </div>

            <Link to={categoryViewAllRoute} className="flex items-center gap-1 text-sm font-bold text-[#176b38]">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FestivalCategorySlider categories={festivalCategories.length > 0 ? festivalCategories : categoryDefinitions.slice(0,6).map(d => ({ id: d.fallbackName, name: d.fallbackName, description: d.description, categorySlug: undefined, image: currentFestival.categoryFallbackImage }))} />
        </section>

        <FestivalOfferBanner targetRoute={heroRoute} />

        <section className="mt-6 rounded-[24px] border border-[#e7efd9] bg-[#f4faf2] px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#e97920]">
                SHOP FRESH
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#155d32] sm:text-[30px]">
                Fresh Picks for Every Day
              </h2>

              <p className="mt-1 text-sm text-[#66736a]">
                Fresh fruits, vegetables and everyday essentials from your local Mana Santa store
              </p>
            </div>

            <Link
              to="/shop-fresh"
              className="flex items-center gap-1 text-sm font-bold text-[#176b38]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {shopFreshLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[280px] animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : shopFreshProducts.length === 0 ? (
            <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-[#dfe7d5] bg-white text-sm font-medium text-[#5d6d5f]">
              No fresh products available right now.
            </div>
          ) : (
            <FestivalProducts products={shopFreshProducts} />
          )}
        </section>

        <section className="mt-5 hidden rounded-[24px] bg-[#087c3b] p-2 lg:block">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-[18px] border border-white/15 bg-white/10 px-4 py-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="text-sm font-bold text-white">{title}</div>
                  <div className="mt-0.5 text-xs text-white/75">{subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[24px] border border-[#e2ebd5] bg-[#f7f9f3] px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#e97920]">
                Handpicked for you
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-[#155d32] sm:text-[30px]">
                Handpicked for You
              </h2>

              <p className="mt-1 text-sm text-[#66736a]">
                Daily essentials picked from your local Mana Santa store
              </p>
            </div>

            <Link
              to="/kirana-essentials"
              className="flex items-center gap-1 text-sm font-bold text-[#176b38]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[280px] animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : (
            <FestivalProducts products={handpickedProducts} />
          )}
        </section>

        <section className="relative mt-6 overflow-hidden rounded-[24px] border border-[#d5eab7] bg-gradient-to-r from-[#eff9df] via-[#f7f7d9] to-[#e1f3c8] px-5 py-7 sm:px-8">
          <div className="relative z-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-[#a7d493] bg-white/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#28723b]">
                Daily Essentials
              </div>

              <h2 className="text-2xl font-black tracking-tight text-[#276638] sm:text-3xl">
                for a Happier Home
              </h2>

              <p className="mt-2 text-sm text-[#55705a] sm:text-base">
                Fresh Groceries&nbsp; | &nbsp;Premium Brands&nbsp; | &nbsp;Local Favourites
              </p>
            </div>

            <Link
              to="/kirana-essentials"
              className="inline-flex items-center gap-2 rounded-full bg-[#087c3b] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#066d34]"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

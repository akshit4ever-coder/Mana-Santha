// @ts-nocheck
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import CategoryRail from "@/components/Layout/CategoryRail";
import { useCategories, useProducts } from "@/lib/queries";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Shop ${params.slug.replace(/-/g, " ")} — Mana Santha` },
      { name: "description", content: `Browse and buy ${params.slug.replace(/-/g, " ")} online. Fresh, best prices, fast delivery.` },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: cats } = useCategories();
  const { data: products } = useProducts({ categorySlug: slug });
  const [sort, setSort] = useState("relevance");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<Record<string, boolean>>({});
  const category = cats?.find((c) => c.slug === slug);

  // Use nested subcategories loaded with categories (fallback to empty array)
  const [fetchedSubcategories, setFetchedSubcategories] = useState<any[] | null>(null);
  const subcategories = (fetchedSubcategories ?? (category?.subcategories ?? [])) as any[];

  // If category doesn't include nested subcategories from the categories query, fetch them directly
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!category?.id) return;
      const existing = category.subcategories ?? [];
      if (existing && existing.length > 0) return;
      try {
        const { data } = await (supabase as any).from("subcategories").select("*").eq("category_id", category.id).eq("is_active", true).order("name");
        if (!mounted) return;
        setFetchedSubcategories(data ?? []);
      } catch (e) {
        console.warn("Failed to load subcategories for category", category.id, e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [category?.id]);

  const sorted = [...(products as any[] ?? [])].sort((a: any, b: any) => {
    const aPrice = Number(a.selling_price ?? a.price ?? 0);
    const bPrice = Number(b.selling_price ?? b.price ?? 0);
    if (sort === "price-asc") return aPrice - bPrice;
    if (sort === "price-desc") return bPrice - aPrice;
    if (sort === "discount") {
      const aMrp = Number(a.mrp ?? 0);
      const bMrp = Number(b.mrp ?? 0);
      const da = (aMrp - aPrice) / (aMrp || 1);
      const db = (bMrp - bPrice) / (bMrp || 1);
      return db - da;
    }
    return 0;
  });

  // Filter products by selected subcategory (if any)
  const displayedProducts = selectedSubcategoryId ? sorted.filter((p: any) => p.subcategory_id === selectedSubcategoryId) : sorted;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-4 shadow-card">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Categories</h3>
            <div className="flex gap-3">
              <CategoryRail
                categories={cats ?? []}
                subcategories={subcategories}
                currentSlug={slug}
                selectedSubcategoryId={selectedSubcategoryId}
                onSelectSubcategory={(id) => setSelectedSubcategoryId(id)}
              />
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{category?.name ?? "Products"}</h1>
              <p className="text-sm text-muted-foreground">{displayedProducts.length} products</p>
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="discount">Highest Discount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile: horizontal subcategory scroller */}
          {subcategories && subcategories.length > 0 && (
            <div className="mb-4 lg:hidden">
              <div className="-mx-4 overflow-x-auto px-4">
                <div className="flex gap-3">
                  <button onClick={() => setSelectedSubcategoryId(null)} className={`min-w-[90px] rounded-lg border px-3 py-2 ${selectedSubcategoryId === null ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`}>All</button>
                  {subcategories.map((s) => (
                    <button key={s.id} onClick={() => setSelectedSubcategoryId(s.id)} className={`min-w-[90px] flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 ${selectedSubcategoryId === s.id ? "bg-primary/10 font-semibold text-primary" : "bg-card"}`}>
                      <div className="mb-1 flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {s.image_url ? <img src={s.image_url} alt={s.name} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="text-sm">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {subcategories && subcategories.length > 0 ? (
            <div className="space-y-8">
              {(selectedSubcategoryId ? subcategories.filter((s:any) => s.id === selectedSubcategoryId) : subcategories).map((sub: any) => {
                const items = displayedProducts.filter((p: any) => p.subcategory_id === sub.id);
                return (
                  <section key={sub.id}>
                    <h2 className="mb-3 text-xl font-semibold">{sub.name}</h2>
                    {items.length === 0 ? (
                      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
                        No products in this subcategory yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {items.map((p: any) => <ProductCard key={p.id} product={p} />)}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">No products in this category yet.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {displayedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

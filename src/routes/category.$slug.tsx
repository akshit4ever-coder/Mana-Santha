import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useCategories, useProducts } from "@/lib/queries";
import { useState } from "react";
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
  const category = cats?.find((c) => c.slug === slug);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", category?.id ?? "")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!category?.id,
  });

  const sorted = [...(products ?? [])].sort((a, b) => {
    const aPrices = (a.product_variants ?? []).filter((v: any) => v.is_active !== false).map((v: any) => Number(v.selling_price ?? v.price ?? 0));
    const bPrices = (b.product_variants ?? []).filter((v: any) => v.is_active !== false).map((v: any) => Number(v.selling_price ?? v.price ?? 0));
    const aMin = aPrices.length ? Math.min(...aPrices) : Number(a.price);
    const bMin = bPrices.length ? Math.min(...bPrices) : Number(b.price);
    if (sort === "price-asc") return aMin - bMin;
    if (sort === "price-desc") return bMin - aMin;
    if (sort === "discount") {
      const aMrp = aPrices.length ? Math.min(...(a.product_variants.map((v:any)=>Number(v.mrp||0)))) : Number(a.mrp);
      const bMrp = bPrices.length ? Math.min(...(b.product_variants.map((v:any)=>Number(v.mrp||0)))) : Number(b.mrp);
      const da = (aMrp - aMin) / (aMrp || 1);
      const db = (bMrp - bMin) / (bMrp || 1);
      return db - da;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto grid gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border bg-card p-4 shadow-card">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Categories</h3>
            <div className="flex flex-col gap-1">
              {cats?.map((c) => (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${c.slug === slug ? "bg-primary/10 font-semibold text-primary" : "hover:bg-secondary"}`}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{category?.name ?? "Products"}</h1>
              <p className="text-sm text-muted-foreground">{sorted.length} products</p>
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

          {subcategories && subcategories.length > 0 ? (
            <div className="space-y-8">
              {subcategories.map((sub: any) => {
                const items = sorted.filter((p: any) => p.subcategory_id === sub.id);
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
              {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts, searchActiveCombos } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import ComboOffer from "@/components/ComboOffer";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search — Mana Santa" }, { name: "description", content: "Search Mana Santa for groceries and kirana essentials." }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data } = useProducts({ search: q });
  const { data: combos } = useQuery({ queryKey: ["search-combos", q], queryFn: async () => await searchActiveCombos(q), enabled: !!q });

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Search results{q ? ` for "${q}"` : ""}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{data?.length ?? 0} products found</p>
          {combos && combos.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-bold">Combo matches</h2>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {combos.map((c: any) => (
                  <div key={c.id} className="rounded-lg border bg-white p-3">
                    <div className="flex items-center gap-3">
                      <img src={c.image_url || '/src/assets/combos/daily_combo_poster.png'} alt={c.name} className="h-20 w-20 rounded-md object-cover" />
                      <div>
                        <div className="font-bold">{c.name}</div>
                        <div className="text-sm text-muted-foreground">{c.offer_price ? `₹${c.offer_price}` : `₹${c.price}`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        {data && data.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-16 text-center text-muted-foreground shadow-card">No products match your search.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/lib/queries";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Search — Mana Santha" }, { name: "description", content: "Search Mana Santha for groceries and kirana essentials." }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data } = useProducts({ search: q });

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">Search results{q ? ` for "${q}"` : ""}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{data?.length ?? 0} products found</p>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { useCategories } from "@/lib/queries";

export const Route = createFileRoute("/shop-fresh")({
  head: () => ({ meta: [{ title: "Shop Fresh — Mana Santha" }, { name: "description", content: "Fresh fruits, vegetables, dairy, eggs & meat." }] }),
  component: ShopFreshPage,
});

function ShopFreshPage() {
  const { data: cats } = useCategories();
  const freshCats = (cats || []).filter((c: any) => {
    const n = (c.name || "").toLowerCase();
    const s = (c.slug || "").toLowerCase();
    return /fruit|veget|milk|dairy|egg|meat/.test(n) || /fruit|veget|milk|dairy|egg|meat/.test(s);
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Shop Fresh</h1>
          <p className="text-sm text-muted-foreground">Fruits, vegetables, milk & products, eggs & meat</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {freshCats.map((c: any) => (
            <Link key={c.id} to="/category/$slug" params={{ slug: c.slug }} className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden bg-gradient-fresh text-3xl">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="h-full w-full object-cover rounded-none" />
                ) : (
                  c.icon
                )}
              </div>
              <div className="text-xs font-medium leading-tight">{c.name}</div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, Clock, Tag } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useCategories, useProducts } from "@/lib/queries";
import { Button } from "@/components/UI/button";
import heroImg from "@/assets/hero-groceries.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mana Santha — Fresh Groceries Delivered to Your Doorstep" },
      { name: "description", content: "Order fresh fruits, vegetables, dairy, atta, dal, oil, snacks and everyday kirana essentials online with fast home delivery." },
      { property: "og:title", content: "Mana Santha — Fresh Groceries Delivered" },
      { property: "og:description", content: "Shop kirana, produce, dairy and household essentials with same-day delivery." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: cats } = useCategories();
  const { data: featured } = useProducts({ featured: true, limit: 10 });
  const { data: all } = useProducts({ limit: 20 });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImg} alt="" width={1600} height={900} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" />
          </div>
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="max-w-xl text-primary-foreground">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-accent-foreground">
                <Tag className="h-3.5 w-3.5" /> First order free delivery
              </div>
              <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Fresh Groceries, Delivered Fast</h1>
              <p className="mt-4 text-lg opacity-90">From farm-fresh produce to your favourite kirana brands — everything you need, delivered to your doorstep.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link to="/shop-fresh">Shop Fresh</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link to="/kirana-essentials">Kirana essentials</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value props */}
        <section className="border-b bg-secondary/40">
          <div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4">
            {[
              { icon: Truck, t: "Fast Delivery", d: "Same-day slots" },
              { icon: ShieldCheck, t: "100% Fresh", d: "Farm-picked daily" },
              { icon: Clock, t: "24/7 Support", d: "We're here to help" },
              { icon: Tag, t: "Best Prices", d: "Everyday low costs" },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="text-xs text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {cats?.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}` as any}
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow"
              >
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
        </section>

        {/* Featured / Bestsellers */}
        <section className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Best Sellers</h2>
              <p className="text-sm text-muted-foreground">Handpicked favourites, delivered fast</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featured?.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Trending */}
        <section className="container mx-auto px-4 py-10">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Fresh Arrivals</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {all?.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

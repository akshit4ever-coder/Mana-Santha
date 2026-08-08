import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useAuth } from "@/lib/auth";
import { useWishlist } from "@/lib/queries";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Mana Santha" }, { name: "description", content: "Your saved products." }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { user } = useAuth();
  const { data: wl } = useWishlist(user?.id);

  if (!user) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Please <Link to="/auth" className="text-primary underline">sign in</Link>.</div></div>);

  return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container mx-auto px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Your Wishlist</h1>
        {(!wl || wl.length === 0) ? (
          <div className="rounded-xl border bg-card p-16 text-center shadow-card">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold">No saved items</p>
            <Link to="/" className="mt-4 inline-block text-primary underline">Browse products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {wl.map((w: any) => w.products && <ProductCard key={w.id} product={w.products} />)}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

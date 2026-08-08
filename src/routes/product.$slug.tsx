import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Truck, ShieldCheck, Loader2, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { useAuth } from "@/lib/auth";
import { useAddToCart, useCart, useProduct, useProducts, useToggleWishlist, useUpdateCartQty, useWishlist } from "@/lib/queries";
import { formatINR, discountPct } from "@/lib/format";
import { ProductCard } from "@/components/products/ProductCard";
import { PLACEHOLDER_IMAGE } from "@/lib/product-storage";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Mana Santha` },
      { name: "description", content: `Buy ${params.slug.replace(/-/g, " ")} online at best prices.` },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { user } = useAuth();
  const { data: cart } = useCart(user?.id);
  const { data: wl } = useWishlist(user?.id);
  const add = useAddToCart(user?.id);
  const upd = useUpdateCartQty(user?.id);
  const wish = useToggleWishlist(user?.id);
  const { data: related } = useProducts({ categorySlug: product?.categories?.slug, limit: 10 });

  const variants = product?.product_variants ?? [];
  const firstVariant = variants.find((v: any) => v.is_active !== false) ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(firstVariant?.id ?? null);

  useEffect(() => {
    if (!product) return;
    const activeVariantExists = selectedVariantId ? variants.some((v: any) => v.id === selectedVariantId) : false;
    if (!activeVariantExists && firstVariant) {
      setSelectedVariantId(firstVariant.id);
    }
  }, [product, variants, firstVariant, selectedVariantId]);

  const selectedVariant = useMemo(() => {
    if (!product) return null;
    return variants.find((v: any) => v.id === selectedVariantId) ?? firstVariant ?? null;
  }, [product, variants, selectedVariantId, firstVariant]);

  const displayPrice = useMemo(() => {
    if (!product) return 0;
    return selectedVariant
      ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price)
      : Number(product.price);
  }, [selectedVariant, product]);

  const displayMrp = useMemo(() => {
    if (!product) return 0;
    return selectedVariant
      ? Number(selectedVariant.mrp ?? product.mrp)
      : Number(product.mrp);
  }, [selectedVariant, product]);

  const pct = useMemo(() => discountPct(displayMrp, displayPrice), [displayMrp, displayPrice]);

  const item = cart?.find((c) => c.product_id === product?.id && (selectedVariant ? c.variant_id === selectedVariant.id : c.variant_id == null));
  const isWish = wl?.some((w) => w.product_id === product?.id);

  if (isLoading) return (<div className="min-h-screen"><Header /><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></div>);
  if (!product) return (<div className="min-h-screen"><Header /><div className="py-20 text-center">Product not found</div></div>);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <nav className="mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          {product.categories && (<> / <Link to="/category/$slug" params={{ slug: product.categories.slug }} className="hover:text-primary">{product.categories.name}</Link></>)}
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border bg-card shadow-card">
            <img
              src={selectedVariant?.image_url || product.image_url || PLACEHOLDER_IMAGE}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
              onError={(e: any) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
            {pct > 0 && <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">{pct}% OFF</Badge>}
          </div>

          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</div>
            <h1 className="mt-1 text-3xl font-bold leading-tight">{product.name}</h1>
            <div className="mt-1 text-sm text-muted-foreground">{selectedVariant?.unit ?? selectedVariant?.quantity_value ? `${selectedVariant.quantity_value ?? ''} ${selectedVariant.unit ?? ''}`.trim() : product.weight ?? product.unit}</div>

            <div className="mt-4 flex items-end gap-3">
              <div className="text-3xl font-extrabold text-primary">{formatINR(displayPrice)}</div>
              {pct > 0 && (<><div className="text-lg text-muted-foreground line-through">{formatINR(displayMrp)}</div><div className="text-sm font-semibold text-success">Save {pct}%</div></>)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</div>

            {product.description && (<p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>)}

            {product.product_variants && product.product_variants.length > 0 && (
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">{product.variant_option_name ?? 'Size'}</div>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((v: any) => (
                    <button key={v.id} className={`rounded-full px-3 py-1 text-sm border ${selectedVariantId === v.id ? 'border-primary bg-primary/10' : ''}`} onClick={() => setSelectedVariantId(v.id)}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {item ? (
                <div className="flex items-center gap-2 rounded-full bg-primary p-1 text-primary-foreground">
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground" onClick={() => upd.mutate({ id: item.id, quantity: item.quantity - 1 })}><Minus className="h-4 w-4" /></Button>
                  <span className="min-w-10 text-center text-lg font-bold">{item.quantity}</span>
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground" disabled={item.quantity >= (selectedVariant?.max_qty ?? product.max_qty) || item.quantity >= (selectedVariant ? selectedVariant.stock : product.stock)} onClick={() => upd.mutate({ id: item.id, quantity: item.quantity + 1 })}><Plus className="h-4 w-4" /></Button>
                </div>
              ) : (
                <Button size="lg" disabled={(selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0) || (selectedVariant ? selectedVariant.max_qty <= 0 : product.max_qty <= 0)} onClick={() => add.mutate({ productId: product.id, variant: selectedVariant ? {
                  id: selectedVariant.id,
                  name: selectedVariant.name,
                  price: selectedVariant.selling_price ?? selectedVariant.price,
                  mrp: selectedVariant.mrp,
                  image_url: selectedVariant.image_url ?? product.image_url,
                  unit: selectedVariant.unit ?? product.unit,
                  max_qty: selectedVariant.max_qty ?? product.max_qty,
                } : undefined })} className="rounded-full">
                  {(selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0) ? "Out of stock" : "Add to Cart"}
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => wish.mutate(product.id)} className="rounded-full">
                <Heart className={`mr-2 h-4 w-4 ${isWish ? "fill-destructive text-destructive" : ""}`} /> {isWish ? "Saved" : "Wishlist"}
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card"><Truck className="h-5 w-5 text-primary" /><div><div className="font-semibold">Fast delivery</div><div className="text-xs text-muted-foreground">Same-day slots</div></div></div>
              <div className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card"><ShieldCheck className="h-5 w-5 text-primary" /><div><div className="font-semibold">100% quality</div><div className="text-xs text-muted-foreground">Fresh guarantee</div></div></div>
            </div>

            <div className="mt-6 rounded-lg border bg-card p-4 text-sm shadow-card">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">SKU</div><div className="font-medium">{selectedVariant?.sku ?? product.sku ?? "-"}</div>
                <div className="text-muted-foreground">Unit</div><div className="font-medium">{selectedVariant?.unit ?? product.unit}</div>
                <div className="text-muted-foreground">Weight</div><div className="font-medium">{selectedVariant?.quantity_value ? `${selectedVariant.quantity_value} ${selectedVariant.unit ?? ""}`.trim() : product.weight ?? "-"}</div>
                <div className="text-muted-foreground">In stock</div><div className="font-medium">{selectedVariant ? selectedVariant.stock : product.stock} available</div>
                <div className="text-muted-foreground">Max per order</div><div className="font-medium">{selectedVariant ? selectedVariant.max_qty : product.max_qty}</div>
              </div>
            </div>
          </div>
        </div>

        {related && related.length > 1 && (
          <section className="mt-14">
            <h2 className="mb-4 text-xl font-bold">Similar products</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.filter((r) => r.id !== product.id).slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

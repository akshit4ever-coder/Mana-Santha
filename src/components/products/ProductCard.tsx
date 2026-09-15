// @ts-nocheck
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Minus, Loader2, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import { useAuth } from "@/lib/auth";
import { useAddToCart, useCart, useToggleWishlist, useUpdateCartQty, useWishlist } from "@/lib/queries";
import { formatINR, discountPct } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/product-storage";
import { isProductAvailable, isVariantAvailable } from "@/lib/product-availability";

export function ProductCard({ product }: { product: any }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: cart } = useCart(user?.id);
  const { data: wishlist } = useWishlist(user?.id);
  const add = useAddToCart(user?.id);
  const update = useUpdateCartQty(user?.id);
  const wish = useToggleWishlist(user?.id);
  const firstVariant = product.product_variants?.find((v: any) => v.is_active !== false) ?? null;
  const [selectedVariant, setSelectedVariant] = useState<any | null>(firstVariant ?? null);
  const rawItem: any = (cart as any)?.find((c: any) => c.product_id === product.id);
  const item: any = rawItem && (selectedVariant ? rawItem.variant_id === selectedVariant.id : rawItem.variant_id == null) ? rawItem : null;
  const displayPrice = selectedVariant ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price) : Number(product.price);
  const displayMrp = selectedVariant ? Number(selectedVariant.mrp ?? product.mrp) : Number(product.mrp);
  const pct = discountPct(displayMrp, displayPrice);
  const selectedVariantAvailable = selectedVariant ? isVariantAvailable(product, selectedVariant) : isProductAvailable(product);
  const outOfStock = !isProductAvailable(product);
  const isWish = wishlist?.some((w: any) => w.product_id === product.id);
  const authRedirect = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search || ""}` : "/";
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'wishlist' | 'cart'>('wishlist');

  const handleWishlistToggle = () => {
    if (!user) {
      setAuthDialogMode('wishlist');
      setAuthDialogOpen(true);
      return;
    }
    wish.mutate(product.id);
  };

  return (
    <div className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-xl border border-[#edf2ea] bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-[1/1.02] overflow-hidden bg-secondary/40">
        <img
          src={selectedVariant?.image_url || firstVariant?.image_url || product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e: any) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        {pct > 0 && (
          <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground shadow">{pct}% OFF</Badge>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-semibold">Out of stock</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</div>
        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 min-h-[38px] text-sm font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <div className="text-xs text-muted-foreground">{product.weight ?? product.unit}</div>
        {product.product_variants && product.product_variants.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {product.product_variants.filter((v: any) => v.is_active !== false).map((v: any) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`rounded-lg border px-2 py-1 text-xs ${selectedVariant?.id === v.id ? 'bg-primary/10 text-primary font-semibold' : 'bg-card hover:bg-secondary'}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <div className="text-base font-bold">{formatINR(displayPrice)}</div>
            {pct > 0 && <div className="text-xs text-muted-foreground line-through">{formatINR(displayMrp)}</div>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant={isWish ? "default" : "outline"}
              aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
              className={`h-9 w-9 rounded-full ${isWish ? "bg-primary text-primary-foreground" : "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"}`}
              onClick={handleWishlistToggle}
              disabled={wish.isLoading}
            >
              <Heart className={`h-4 w-4 ${isWish ? "fill-current" : ""}`} />
            </Button>
            {item ? (
              <div className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground"
                  onClick={() => update.mutate({ id: (item as any).id, quantity: (item as any).quantity - 1 })}>
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="min-w-6 text-center text-sm font-bold">{(item as any).quantity}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground"
                  disabled={!isProductAvailable(selectedVariant ?? product) || (((item as any).quantity >= (((item as any)['variant_max_qty'] ?? selectedVariant?.max_qty ?? firstVariant?.max_qty ?? product.max_qty))) || (item as any).quantity >= ((selectedVariant?.stock ?? firstVariant?.stock) ?? product.stock))}
                  onClick={() => update.mutate({ id: (item as any).id, quantity: (item as any).quantity + 1 })}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              ) : (
              <Button
                size="sm"
                variant="outline"
                disabled={!selectedVariantAvailable || add.isPending}
                onClick={() => {
                  if (!user) {
                    setAuthDialogMode('cart');
                    setAuthDialogOpen(true);
                    return;
                  }
                  add.mutate({ productId: product.id, variant: selectedVariant ? {
                    id: selectedVariant.id,
                    name: selectedVariant.name,
                    price: selectedVariant.selling_price ?? selectedVariant.price,
                    mrp: selectedVariant.mrp,
                    image_url: selectedVariant.image_url ?? product.image_url,
                    unit: selectedVariant.unit ?? product.unit,
                  } : undefined });
                }}
                className="h-9 rounded-full border-primary/30 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ADD"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{authDialogMode === 'cart' ? 'Sign in to add product to cart.' : 'Sign in to save your favorite products.'}</DialogTitle>
              <DialogDescription>
                {authDialogMode === 'cart' ? 'Sign in to add items to your cart and checkout securely.' : 'Save products you love and keep track of them after you sign in.'}
              </DialogDescription>
            </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setAuthDialogOpen(false);
                navigate({ to: "/auth", search: { redirect: authRedirect, mode: "signin" } as any });
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setAuthDialogOpen(false);
                navigate({ to: "/auth", search: { redirect: authRedirect, mode: "signup" } as any });
              }}
            >
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

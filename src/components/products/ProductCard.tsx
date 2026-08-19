import { Link } from "@tanstack/react-router";
import { Plus, Minus, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { useAuth } from "@/lib/auth";
import { useAddToCart, useCart, useUpdateCartQty } from "@/lib/queries";
import { formatINR, discountPct } from "@/lib/format";
import { PLACEHOLDER_IMAGE } from "@/lib/product-storage";

export function ProductCard({ product }: { product: any }) {
  const { user } = useAuth();
  const { data: cart } = useCart(user?.id);
  const add = useAddToCart(user?.id);
  const update = useUpdateCartQty(user?.id);
  const firstVariant = product.product_variants?.find((v: any) => v.is_active !== false) ?? null;
  const [selectedVariant, setSelectedVariant] = useState<any | null>(firstVariant ?? null);
  const item = cart?.find((c) => c.product_id === product.id && (selectedVariant ? c.variant_id === selectedVariant.id : c.variant_id == null));
  const displayPrice = selectedVariant ? Number(selectedVariant.selling_price ?? selectedVariant.price ?? product.price) : Number(product.price);
  const displayMrp = selectedVariant ? Number(selectedVariant.mrp ?? product.mrp) : Number(product.mrp);
  const pct = discountPct(displayMrp, displayPrice);
  const outOfStock = selectedVariant ? (selectedVariant.stock ?? 0) <= 0 : (product.stock ?? 0) <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={selectedVariant?.image_url || firstVariant?.image_url || product.image_url || PLACEHOLDER_IMAGE}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
        <Link to="/product/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <div className="text-xs text-muted-foreground">{product.weight ?? product.unit}</div>
        {product.product_variants && product.product_variants.length > 0 && (
          <div className="mt-2 flex gap-2">
            {product.product_variants.filter((v: any) => v.is_active !== false).map((v: any) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`rounded-lg px-2 py-1 text-xs border ${selectedVariant?.id === v.id ? 'bg-primary/10 text-primary font-semibold' : 'bg-card hover:bg-secondary'}`}
              >
                {v.name}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-base font-bold">{formatINR(displayPrice)}</div>
            {pct > 0 && <div className="text-xs text-muted-foreground line-through">{formatINR(displayMrp)}</div>}
          </div>
          {item ? (
            <div className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground"
                onClick={() => update.mutate({ id: item.id, quantity: item.quantity - 1 })}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-glow/40 hover:text-primary-foreground"
                disabled={item.quantity >= (item.variant_max_qty ?? selectedVariant?.max_qty ?? firstVariant?.max_qty ?? product.max_qty) || item.quantity >= ((selectedVariant?.stock ?? firstVariant?.stock) ?? product.stock)}
                onClick={() => update.mutate({ id: item.id, quantity: item.quantity + 1 })}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={outOfStock || add.isPending}
              onClick={() => add.mutate({ productId: product.id, variant: selectedVariant ? {
                id: selectedVariant.id,
                name: selectedVariant.name,
                price: selectedVariant.selling_price ?? selectedVariant.price,
                mrp: selectedVariant.mrp,
                image_url: selectedVariant.image_url ?? product.image_url,
                unit: selectedVariant.unit ?? product.unit,
              } : undefined })}
              className="h-9 rounded-full border-primary/30 font-semibold text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ADD"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

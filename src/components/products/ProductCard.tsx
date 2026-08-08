import { Link } from "@tanstack/react-router";
import { Plus, Minus, Loader2 } from "lucide-react";
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
  const item = cart?.find((c) => c.product_id === product.id && (firstVariant ? c.variant_id === firstVariant.id : c.variant_id == null));
  const displayPrice = firstVariant ? Number(firstVariant.selling_price ?? firstVariant.price ?? product.price) : Number(product.price);
  const displayMrp = firstVariant ? Number(firstVariant.mrp ?? product.mrp) : Number(product.mrp);
  const pct = discountPct(displayMrp, displayPrice);
  const outOfStock = firstVariant ? firstVariant.stock <= 0 : product.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={firstVariant?.image_url || product.image_url || PLACEHOLDER_IMAGE}
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
                disabled={item.quantity >= (item.variant_max_qty ?? firstVariant?.max_qty ?? product.max_qty) || item.quantity >= (firstVariant ? firstVariant.stock : product.stock)}
                onClick={() => update.mutate({ id: item.id, quantity: item.quantity + 1 })}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={outOfStock || add.isPending}
              onClick={() => add.mutate({ productId: product.id, variant: firstVariant ? {
                id: firstVariant.id,
                name: firstVariant.name,
                price: firstVariant.selling_price ?? firstVariant.price,
                mrp: firstVariant.mrp,
                image_url: firstVariant.image_url ?? product.image_url,
                unit: firstVariant.unit ?? product.unit,
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

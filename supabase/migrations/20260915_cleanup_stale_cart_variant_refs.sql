-- Repair stale cart variant references without deleting cart items.
-- This keeps valid simple products intact while clearing invalid or mismatched variant pointers.

-- 1) Remove cart references that point to a variant row that no longer exists.
UPDATE public.cart_items c
SET variant_id = NULL
WHERE c.variant_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.product_variants v
    WHERE v.id = c.variant_id
  );

-- 2) Remove references where the variant belongs to a different product than the cart item.
UPDATE public.cart_items c
SET variant_id = NULL
WHERE c.variant_id IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.product_variants v
    WHERE v.id = c.variant_id
      AND v.product_id IS DISTINCT FROM c.product_id
  );

-- 3) optional safety: add a foreign key so future stale refs are prevented.
-- Use NOT VALID first to avoid breaking existing rows while the cleanup above runs.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.cart_items'::regclass
      AND conname = 'cart_items_variant_id_fkey'
  ) THEN
    ALTER TABLE public.cart_items
      ADD CONSTRAINT cart_items_variant_id_fkey
      FOREIGN KEY (variant_id)
      REFERENCES public.product_variants(id)
      ON DELETE SET NULL
      NOT VALID;
  END IF;
END $$;

-- You can validate the constraint after the stale refs are cleaned up and confirmed.
-- ALTER TABLE public.cart_items VALIDATE CONSTRAINT cart_items_variant_id_fkey;

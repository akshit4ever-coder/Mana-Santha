-- Ensure cart_items and order_items have variant snapshot fields for current deployments
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS variant_name TEXT,
  ADD COLUMN IF NOT EXISTS variant_unit TEXT,
  ADD COLUMN IF NOT EXISTS variant_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS variant_image_url TEXT,
  ADD COLUMN IF NOT EXISTS variant_max_qty INT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.cart_items'::regclass
      AND contype = 'u'
      AND conname = 'cart_items_user_id_product_id_key'
  ) THEN
    ALTER TABLE public.cart_items DROP CONSTRAINT cart_items_user_id_product_id_key;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_index WHERE indexrelid = 'cart_items_user_product_idx'::regclass
  ) THEN
    DROP INDEX IF EXISTS cart_items_user_product_idx;
  END IF;
  CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_variant_idx ON public.cart_items(user_id, product_id, variant_id);
  CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_no_variant_idx ON public.cart_items(user_id, product_id) WHERE variant_id IS NULL;
END
$$;

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS variant_id UUID,
  ADD COLUMN IF NOT EXISTS variant_name TEXT,
  ADD COLUMN IF NOT EXISTS variant_unit TEXT,
  ADD COLUMN IF NOT EXISTS variant_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS variant_image_url TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'wishlist_items'
      AND column_name = 'combo_id'
  ) THEN
    RAISE NOTICE 'combo_id already exists on public.wishlist_items';
  ELSE
    ALTER TABLE public.wishlist_items
      ADD COLUMN combo_id UUID NULL REFERENCES public.combos(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage ccu
    JOIN information_schema.table_constraints tc
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = 'wishlist_items'
      AND tc.constraint_type = 'CHECK'
      AND tc.constraint_name = 'wishlist_items_product_or_combo_check'
  ) THEN
    RAISE NOTICE 'wishlist_items_product_or_combo_check already exists';
  ELSE
    ALTER TABLE public.wishlist_items
      ADD CONSTRAINT wishlist_items_product_or_combo_check
      CHECK (
        (product_id IS NOT NULL AND combo_id IS NULL)
        OR
        (product_id IS NULL AND combo_id IS NOT NULL)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'wishlist_items_user_combo_idx'
  ) THEN
    CREATE INDEX wishlist_items_user_combo_idx
      ON public.wishlist_items (user_id, combo_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'wishlist_items_user_combo_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX wishlist_items_user_combo_unique_idx
      ON public.wishlist_items (user_id, combo_id)
      WHERE combo_id IS NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'wishlist_items'
      AND column_name = 'product_id'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.wishlist_items
      ALTER COLUMN product_id DROP NOT NULL;
  END IF;
END $$;

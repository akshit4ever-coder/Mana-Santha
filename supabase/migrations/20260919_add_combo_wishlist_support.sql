ALTER TABLE public.wishlist_items
  ADD COLUMN IF NOT EXISTS combo_id UUID NULL REFERENCES public.combos(id) ON DELETE CASCADE;

ALTER TABLE public.wishlist_items
  ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE public.wishlist_items
  DROP CONSTRAINT IF EXISTS wishlist_items_exactly_one_target_chk;

ALTER TABLE public.wishlist_items
  ADD CONSTRAINT wishlist_items_exactly_one_target_chk
  CHECK (
    (product_id IS NOT NULL) <> (combo_id IS NOT NULL)
  );

DROP INDEX IF EXISTS wishlist_items_user_product_idx;
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_items_user_product_unique_idx
  ON public.wishlist_items(user_id, product_id)
  WHERE product_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS wishlist_items_user_combo_unique_idx
  ON public.wishlist_items(user_id, combo_id)
  WHERE combo_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS wishlist_items_user_combo_idx
  ON public.wishlist_items(user_id, combo_id);

GRANT SELECT, INSERT, DELETE ON public.wishlist_items TO authenticated;
GRANT ALL ON public.wishlist_items TO service_role;

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can view own wishlist items"
  ON public.wishlist_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can insert own wishlist items"
  ON public.wishlist_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can delete own wishlist items"
  ON public.wishlist_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

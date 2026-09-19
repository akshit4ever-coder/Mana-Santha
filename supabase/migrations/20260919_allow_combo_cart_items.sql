ALTER TABLE public.cart_items
  ALTER COLUMN product_id DROP NOT NULL;

-- Keep combo entries valid while preserving the existing regular-product cart behavior.
-- Regular product rows still set product_id, and combo rows use combo_id + combo_snapshot.

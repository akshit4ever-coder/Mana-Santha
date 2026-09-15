-- Ensure public reads for product_variants are allowed for cart/product display
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'product_variants'
      AND policyname = 'Public read access for product_variants'
  ) THEN
    CREATE POLICY "Public read access for product_variants"
      ON public.product_variants
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

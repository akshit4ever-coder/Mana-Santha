ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMPTZ;

-- Optional: keep it aligned with the existing status / same-day delivery flow.
UPDATE public.orders
SET delivery_date = created_at
WHERE delivery_date IS NULL;

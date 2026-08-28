-- Add address_id column to orders
ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL;

-- Ensure authenticated role can insert/update the new column via existing policy (no change required if policy checks user_id only)
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

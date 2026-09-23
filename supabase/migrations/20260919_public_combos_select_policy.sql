-- Public visibility for active combos, while keeping RLS enabled.

ALTER TABLE public.combos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.combos TO anon, authenticated;
GRANT SELECT ON public.combo_items TO anon, authenticated;
GRANT ALL ON public.combos TO service_role;
GRANT ALL ON public.combo_items TO service_role;

CREATE POLICY "Anyone views active combos"
  ON public.combos
  FOR SELECT
  USING (
    lower(trim(status)) = 'active'
  );

CREATE POLICY "Admins manage combos"
  ON public.combos
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone views combo items for active combos"
  ON public.combo_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.combos c
      WHERE c.id = combo_items.combo_id
        AND lower(trim(c.status)) = 'active'
    )
  );

CREATE POLICY "Admins manage combo items"
  ON public.combo_items
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

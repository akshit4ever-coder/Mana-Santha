-- Add RLS policies to allow customers to access their own combo snapshots and
-- to allow inserts into order_status_audit only for orders they own.

-- Ensure RLS is enabled on combo_order_snapshots
ALTER TABLE public.combo_order_snapshots ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.combo_order_snapshots TO authenticated;
GRANT ALL ON public.combo_order_snapshots TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'combo_order_snapshots' AND policyname = 'Users view own combo snapshots'
  ) THEN
    CREATE POLICY "Users view own combo snapshots"
      ON public.combo_order_snapshots
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = combo_order_snapshots.order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'combo_order_snapshots' AND policyname = 'Admins manage combo snapshots'
  ) THEN
    CREATE POLICY "Admins manage combo snapshots"
      ON public.combo_order_snapshots
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Ensure RLS is enabled on order_status_audit
ALTER TABLE public.order_status_audit ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.order_status_audit TO authenticated;
GRANT ALL ON public.order_status_audit TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_status_audit' AND policyname = 'Users view own order status audit'
  ) THEN
    CREATE POLICY "Users view own order status audit"
      ON public.order_status_audit
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.orders o
          WHERE o.id = order_status_audit.order_id
            AND o.user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_status_audit' AND policyname = 'Users insert own order status audit'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users insert own order status audit"
        ON public.order_status_audit
        FOR INSERT
        TO authenticated
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_id
              AND o.user_id = auth.uid()
          )
        );
    $policy$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_status_audit' AND policyname = 'Admins manage order status audit'
  ) THEN
    CREATE POLICY "Admins manage order status audit"
      ON public.order_status_audit
      FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

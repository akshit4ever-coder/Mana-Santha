CREATE TABLE IF NOT EXISTS public.order_status_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.order_status_audit TO authenticated;
GRANT ALL ON public.order_status_audit TO service_role;

CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF OLD.status = 'pending' AND NEW.status NOT IN ('confirmed', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    ELSIF OLD.status = 'confirmed' AND NEW.status NOT IN ('packed', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    ELSIF OLD.status = 'packed' AND NEW.status NOT IN ('out_for_delivery', 'cancelled') THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    ELSIF OLD.status = 'out_for_delivery' AND NEW.status <> 'delivered' THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    ELSIF OLD.status = 'delivered' THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    ELSIF OLD.status = 'cancelled' OR OLD.status = 'refunded' THEN
      RAISE EXCEPTION 'Invalid order status transition.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_status_transition_guard ON public.orders;
CREATE TRIGGER orders_status_transition_guard
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_status_transition();

CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_changed_by TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
    v_changed_by := COALESCE(current_setting('request.jwt.claim.sub', true), 'system');

    INSERT INTO public.order_status_audit (order_id, old_status, new_status, changed_by, changed_at)
    VALUES (NEW.id, OLD.status::TEXT, NEW.status::TEXT, v_changed_by, now());
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_status_change_log ON public.orders;
CREATE TRIGGER orders_status_change_log
AFTER UPDATE ON public.orders
FOR EACH ROW
WHEN (NEW.status IS DISTINCT FROM OLD.status)
EXECUTE FUNCTION public.log_order_status_change();

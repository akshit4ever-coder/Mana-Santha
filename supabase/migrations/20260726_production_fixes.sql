-- ============ PRODUCTION FIXES & ENHANCEMENTS ============
-- This migration adds critical tables and triggers for production readiness

-- ============ 1. ADD MISSING FIELDS TO PRODUCTS ============
-- Status field for product availability control
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
-- allowed values: 'active', 'inactive', 'out_of_stock', 'discontinued'
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_trending BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_quantity INT NOT NULL DEFAULT 1;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);
CREATE INDEX IF NOT EXISTS products_stock_idx ON public.products(stock);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at);

-- ============ 2. INVENTORY LOGS TABLE ============
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  old_stock INT NOT NULL,
  new_stock INT NOT NULL,
  change_reason TEXT NOT NULL,
  changed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.inventory_logs TO authenticated;
GRANT ALL ON public.inventory_logs TO service_role;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view logs" ON public.inventory_logs FOR SELECT USING (true);
CREATE POLICY "Service role manages logs" ON public.inventory_logs FOR INSERT TO service_role WITH CHECK (true);
CREATE INDEX inventory_logs_product_idx ON public.inventory_logs(product_id);
CREATE INDEX inventory_logs_created_at_idx ON public.inventory_logs(created_at);

-- ============ 3. STOCK DECREASE TRIGGER ============
-- Automatically decrease stock when order items are created
CREATE OR REPLACE FUNCTION public.decrease_product_stock()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id AND stock >= NEW.quantity;
  
  INSERT INTO public.inventory_logs (product_id, old_stock, new_stock, change_reason, changed_by)
  SELECT id, stock + NEW.quantity, stock, 'Order placed', 'system'
  FROM public.products WHERE id = NEW.product_id;
  
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS order_item_decrease_stock ON public.order_items;
CREATE TRIGGER order_item_decrease_stock AFTER INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.decrease_product_stock();

-- ============ 4. STOCK RESTORE TRIGGER ============
-- Restore stock when orders are cancelled
CREATE OR REPLACE FUNCTION public.restore_product_stock_on_cancel()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  item RECORD;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    FOR item IN SELECT * FROM public.order_items WHERE order_id = NEW.id LOOP
      UPDATE public.products
      SET stock = stock + item.quantity
      WHERE id = item.product_id;
      
      INSERT INTO public.inventory_logs (product_id, old_stock, new_stock, change_reason, changed_by)
      VALUES (item.product_id, (SELECT stock - item.quantity FROM public.products WHERE id = item.product_id),
              (SELECT stock FROM public.products WHERE id = item.product_id),
              'Order cancelled', 'system');
    END LOOP;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS order_restore_stock_on_cancel ON public.orders;
CREATE TRIGGER order_restore_stock_on_cancel BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.restore_product_stock_on_cancel();

-- ============ 5. COUPONS TABLE ============
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- 'percentage' or 'flat'
  discount_value NUMERIC(10,2) NOT NULL,
  max_discount NUMERIC(10,2),
  min_cart_value NUMERIC(10,2) NOT NULL DEFAULT 0,
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  per_user_limit INT NOT NULL DEFAULT 1,
  active_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_till TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active coupons" ON public.coupons FOR SELECT USING (is_active = true AND active_till > now());
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER coupons_updated BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX coupons_code_idx ON public.coupons(code);
CREATE INDEX coupons_is_active_idx ON public.coupons(is_active);

-- ============ 6. COUPON USAGE TABLE ============
CREATE TABLE IF NOT EXISTS public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_applied NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);
GRANT SELECT, INSERT ON public.coupon_usage TO authenticated;
GRANT ALL ON public.coupon_usage TO service_role;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own coupon usage" ON public.coupon_usage FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX coupon_usage_user_idx ON public.coupon_usage(user_id);
CREATE INDEX coupon_usage_coupon_idx ON public.coupon_usage(coupon_id);

-- ============ 7. BANNERS TABLE ============
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_till TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active banners" ON public.banners FOR SELECT USING (is_active = true AND valid_till > now());
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER banners_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX banners_position_idx ON public.banners(position);

-- ============ 8. PRODUCT REVIEWS TABLE ============
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  helpful_count INT NOT NULL DEFAULT 0,
  unhelpful_count INT NOT NULL DEFAULT 0,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.product_reviews TO authenticated;
GRANT ALL ON public.product_reviews TO service_role;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views approved reviews" ON public.product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users manage own reviews" ON public.product_reviews FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage all reviews" ON public.product_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER reviews_updated BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX reviews_product_idx ON public.product_reviews(product_id);
CREATE INDEX reviews_user_idx ON public.product_reviews(user_id);
CREATE INDEX reviews_rating_idx ON public.product_reviews(rating);

-- ============ 9. DELIVERY PARTNERS TABLE ============
CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  vehicle_number TEXT,
  vehicle_type TEXT DEFAULT 'bike',
  document_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  total_deliveries INT NOT NULL DEFAULT 0,
  current_load INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.delivery_partners TO authenticated;
GRANT ALL ON public.delivery_partners TO service_role;
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone views active delivery partners" ON public.delivery_partners FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage delivery partners" ON public.delivery_partners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER delivery_partners_updated BEFORE UPDATE ON public.delivery_partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ 10. ADD DELIVERY PARTNER TO ORDERS ============
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_started_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- ============ 11. PAYMENT TRANSACTIONS TABLE ============
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL DEFAULT 'razorpay', -- 'razorpay', 'stripe', 'paypal'
  gateway_transaction_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed', 'refunded'
  error_message TEXT,
  refunded_amount NUMERIC(10,2),
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
);
CREATE POLICY "Admins manage transactions" ON public.payment_transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER payment_transactions_updated BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX payment_transactions_order_idx ON public.payment_transactions(order_id);
CREATE INDEX payment_transactions_status_idx ON public.payment_transactions(status);

-- ============ 12. AUDIT LOGS TABLE ============
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE INDEX audit_logs_user_idx ON public.audit_logs(user_id);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs(created_at);

-- ============ 13. CUSTOMER NOTIFICATIONS TABLE ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE INDEX notifications_user_idx ON public.notifications(user_id);
CREATE INDEX notifications_is_read_idx ON public.notifications(is_read);

-- ============ 14. PERFORMANCE INDEXES ============
CREATE INDEX IF NOT EXISTS orders_user_status_idx ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'cart_items' AND relkind IN ('r','p')) THEN
    DROP INDEX IF EXISTS cart_items_user_product_idx;
    CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_variant_idx ON public.cart_items(user_id, product_id, variant_id);
    CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_no_variant_idx ON public.cart_items(user_id, product_id) WHERE variant_id IS NULL;
  END IF;
END
$$;
CREATE INDEX IF NOT EXISTS wishlist_items_user_product_idx ON public.wishlist_items(user_id, product_id);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);

-- ============ 15. UPDATE PRODUCTS FOR AVAILABILITY CONTROL ============
-- Update seed data to ensure all products have proper status
UPDATE public.products SET status = 'active' WHERE status IS NULL;

-- ============ END MIGRATION ============

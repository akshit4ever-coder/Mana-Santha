CREATE OR REPLACE FUNCTION public.validate_order_item_availability()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  product_row RECORD;
  variant_is_active BOOLEAN;
  variant_stock INT;
  
BEGIN
  IF NEW.quantity IS NULL OR NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Order item quantity must be greater than zero';
  END IF;

  -- Allow combo order items through without product/variant validation.
  -- Combo items are inserted with `unit = 'combo'` and have NULL product_id/variant_id.
  IF LOWER(TRIM(COALESCE(NEW.unit, ''))) = 'combo' THEN
    RETURN NEW;
  END IF;

  IF NEW.variant_id IS NOT NULL THEN
        SELECT p.status AS product_status,
          p.is_active AS product_is_active,
          pv.stock AS variant_stock,
          pv.is_active AS variant_is_active
    INTO product_row
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = NEW.variant_id;

    IF product_row IS NULL THEN
      RAISE EXCEPTION 'Selected product variant does not exist';
    END IF;

    variant_stock := COALESCE(product_row.variant_stock, 0);
    variant_is_active := COALESCE(product_row.variant_is_active, true);

    IF LOWER(TRIM(COALESCE(product_row.product_status, ''))) <> 'active'
       OR COALESCE(product_row.product_is_active, true) IS NOT true
       OR variant_stock <= 0
       OR variant_is_active IS NOT true
    THEN
      RAISE EXCEPTION 'Variant % of product % is not available for purchase', NEW.variant_id, NEW.product_id;
    END IF;

    IF variant_stock < NEW.quantity THEN
      RAISE EXCEPTION 'Order quantity exceeds available variant stock';
    END IF;

    RETURN NEW;
  END IF;

  SELECT * INTO product_row
  FROM public.products
  WHERE id = NEW.product_id;

  IF product_row IS NULL THEN
    RAISE EXCEPTION 'Product does not exist';
  END IF;

  IF product_row.stock <= 0
     OR LOWER(TRIM(COALESCE(product_row.status, ''))) <> 'active'
     OR COALESCE(product_row.is_active, true) IS NOT true
  THEN
    RAISE EXCEPTION 'Product % is not available for purchase', product_row.id;
  END IF;

  IF product_row.stock < NEW.quantity THEN
    RAISE EXCEPTION 'Order quantity exceeds available stock';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS order_items_availability_guard ON public.order_items;
CREATE TRIGGER order_items_availability_guard
BEFORE INSERT OR UPDATE OF quantity, product_id, variant_id
ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_order_item_availability();

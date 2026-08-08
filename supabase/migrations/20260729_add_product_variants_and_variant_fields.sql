-- Add product_variants table and variant-related fields
create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    option_name text,
    name text not null,
    quantity_value numeric,
    unit text,
    sku text,
    barcode text,
    mrp numeric(10,2) not null default 0,
    selling_price numeric(10,2) not null default 0,
    stock int not null default 0,
    max_qty int not null default 20,
    sort_order int not null default 0,
    image_url text,
    is_default boolean not null default false,
    is_active boolean not null default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

grant select on public.product_variants to anon, authenticated;
grant all on public.product_variants to service_role;
alter table public.product_variants enable row level security;

create policy "Anyone views active product variants" on public.product_variants
  for select using (is_active = true);

create policy "Admins manage product variants" on public.product_variants
  for all to authenticated
  using (public.has_role(auth.uid(),'admin'))
  with check (public.has_role(auth.uid(),'admin'));

-- Add variant snapshot columns to order_items
alter table public.order_items
  add column if not exists variant_id uuid,
  add column if not exists variant_name text,
  add column if not exists variant_unit text,
  add column if not exists variant_price numeric(10,2),
  add column if not exists variant_image_url text;

-- Add variant fields to cart_items
alter table public.cart_items
  add column if not exists variant_id uuid,
  add column if not exists variant_name text,
  add column if not exists variant_unit text,
  add column if not exists variant_price numeric(10,2),
  add column if not exists variant_image_url text,
  add column if not exists variant_max_qty int;

-- Indexes
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- Ensure cart uniqueness is variant-aware
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cart_items'::regclass
      AND contype = 'u'
      AND conname = 'cart_items_user_id_product_id_key'
  ) THEN
    ALTER TABLE public.cart_items DROP CONSTRAINT cart_items_user_id_product_id_key;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_index
    WHERE indexrelid = 'cart_items_user_product_idx'::regclass
  ) THEN
    DROP INDEX IF EXISTS cart_items_user_product_idx;
  END IF;
  CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_variant_idx ON public.cart_items(user_id, product_id, variant_id);
  CREATE UNIQUE INDEX IF NOT EXISTS cart_items_user_product_no_variant_idx ON public.cart_items(user_id, product_id) WHERE variant_id IS NULL;
END
$$;

-- Trigger to update updated_at timestamps
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger tg
    JOIN pg_class cls ON tg.tgrelid = cls.oid
    WHERE tg.tgname = 'product_variants_update_updated_at'
      AND cls.relname = 'product_variants'
  ) THEN
    CREATE TRIGGER product_variants_update_updated_at
      BEFORE UPDATE ON public.product_variants
      FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END
$$;

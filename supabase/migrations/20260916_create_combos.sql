-- Create combos and related tables
-- Run at deployment/migration time

create table if not exists combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  description text,
  price numeric not null default 0,
  offer_price numeric,
  image_url text,
  date_valid_from date,
  date_valid_to date,
  stock int default null,
  status text default 'inactive', -- inactive | active | sold_out
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists combo_items (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid references combos(id) on delete cascade,
  product_id uuid,
  variant_id uuid,
  unit_label text,
  quantity numeric default 1,
  sort_order int default 0
);

create table if not exists combo_order_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  combo_id uuid references combos(id) on delete set null,
  snapshot jsonb not null,
  created_at timestamptz default now()
);

-- Add combo fields to cart_items for bundle support
alter table if exists cart_items
  add column if not exists combo_id uuid,
  add column if not exists combo_snapshot jsonb;

create index if not exists idx_combos_date on combos(date_valid_from, date_valid_to);
create index if not exists idx_cart_items_combo on cart_items(combo_id);

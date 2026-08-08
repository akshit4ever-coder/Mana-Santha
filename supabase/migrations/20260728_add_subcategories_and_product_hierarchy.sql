alter table public.categories
  add column if not exists description text;

create table if not exists public.subcategories (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references public.categories(id) on delete cascade,
    category_name text not null,
    name text not null,
    slug text unique,
    description text,
    image_url text,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table public.subcategories enable row level security;

create policy "Anyone views active subcategories"
    on public.subcategories for select
    using (is_active = true);

create policy "Admins manage subcategories"
    on public.subcategories for all
    to authenticated
    using (public.has_role(auth.uid(),'admin'))
    with check (public.has_role(auth.uid(),'admin'));

alter table public.products
  add column if not exists subcategory_id uuid,
  add column if not exists subcategory_name text,
  add column if not exists category_name text,
  add column if not exists sort_order integer default 999;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_subcategory_id_fkey'
  ) then
    alter table public.products
      add constraint products_subcategory_id_fkey
      foreign key (subcategory_id) references public.subcategories(id) on delete set null;
  end if;
end $$;

update public.products p
set category_name = c.name
from public.categories c
where p.category_id = c.id
  and (p.category_name is null or p.category_name = '');

update public.products p
set subcategory_name = s.name
from public.subcategories s
where p.subcategory_id = s.id
  and (p.subcategory_name is null or p.subcategory_name = '');

create or replace function public.sync_product_hierarchy_fields()
returns trigger
language plpgsql
as $$
begin
  if NEW.category_id is not null then
    select name into NEW.category_name
    from public.categories
    where id = NEW.category_id;
  elsif NEW.category_name is null then
    NEW.category_name := null;
  end if;

  if NEW.subcategory_id is not null then
    select name into NEW.subcategory_name
    from public.subcategories
    where id = NEW.subcategory_id;
  elsif NEW.subcategory_name is null then
    NEW.subcategory_name := null;
  end if;

  if NEW.sort_order is null then
    NEW.sort_order := 999;
  end if;

  return NEW;
end;
$$;

drop trigger if exists products_sync_hierarchy on public.products;

create trigger products_sync_hierarchy
before insert or update on public.products
for each row execute function public.sync_product_hierarchy_fields();

-- Create cart_items table
create table if not exists public.cart_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer not null default 1,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    variant_id uuid references public.product_variants(id) on delete cascade,
    variant_name text,
    variant_unit text,
    variant_price numeric(10,2),
    variant_image_url text,
    variant_max_qty int,
    unique(user_id, product_id, variant_id)
);

-- Enable RLS for cart_items
alter table public.cart_items enable row level security;

create policy "Users can view their own cart items"
    on public.cart_items for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own cart items"
    on public.cart_items for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own cart items"
    on public.cart_items for update
    using ( auth.uid() = user_id );

create policy "Users can delete their own cart items"
    on public.cart_items for delete
    using ( auth.uid() = user_id );

-- Create trigger for updated_at
create trigger handle_cart_items_updated_at before update on public.cart_items
  for each row execute procedure update_updated_at_column();

-- Create products bucket using the existing bucket name 'ManaSantha'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ManaSantha',
  'ManaSantha',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
) on conflict (id) do update set 
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies for products bucket
create policy "Public Read Access" on storage.objects
    for select using (bucket_id = 'ManaSantha');

create policy "Authenticated Insert Access" on storage.objects
    for insert with check (bucket_id = 'ManaSantha' and auth.role() = 'authenticated');

create policy "Authenticated Update Access" on storage.objects
    for update using (bucket_id = 'ManaSantha' and auth.role() = 'authenticated');

create policy "Authenticated Delete Access" on storage.objects
    for delete using (bucket_id = 'ManaSantha' and auth.role() = 'authenticated');

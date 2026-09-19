-- Seed initial Daily Vegetable Combo (inactive)
insert into combos (id, name, slug, description, price, offer_price, image_url, date_valid_from, date_valid_to, stock, status, metadata)
values (
  gen_random_uuid(),
  '10 రకాల తాజా కూరగాయలు',
  'daily-vegetable-combo',
  'A rotating daily vegetable combo. Edit contents and publish from admin.',
  199,
  null,
  '/src/assets/combos/daily_combo_poster.png',
  null,
  null,
  0,
  'inactive',
  jsonb_build_object('vegetables', jsonb_build_array('tomato','potato','onion','carrot','brinjal','beans','okra','green mango','coriander','potato'))
);

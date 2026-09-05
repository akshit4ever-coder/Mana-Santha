/**
 * Migration script: create one default product_variant per existing product
 * Usage:
 *   SUPABASE_URL=https://<project>.supabase.co SUPABASE_KEY=<service_role_key> node -r ts-node/register scripts/migrate_variants.ts
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Please set SUPABASE_URL and SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function run() {
  const { data: products, error } = await supabase.from("products").select("id, name, sku, mrp, price, stock, unit, max_qty, image_url");
  if (error) throw error;
  if (!products || products.length === 0) {
    console.log("No products found to migrate.");
    return;
  }

  for (const p of products) {
    const variant = {
      product_id: p.id,
      option_name: 'Size',
      name: p.unit ? `${p.unit}` : 'Default',
      quantity_value: null,
      unit: p.unit ?? null,
      sku: p.sku ?? null,
      mrp: p.mrp ?? 0,
      selling_price: p.price ?? 0,
      stock: p.stock ?? 0,
      max_qty: p.max_qty ?? 20,
      image_url: p.image_url ?? null,
      is_default: true,
      is_active: true,
    };

    const { error: insertErr } = await supabase.from("product_variants").insert(variant);
    if (insertErr) {
      console.error(`Failed to insert variant for product ${p.id}:`, insertErr.message);
    } else {
      console.log(`Inserted variant for product ${p.id}`);
    }
  }
}

run().then(() => console.log("Migration complete")).catch((err) => { console.error(err); process.exit(1); });

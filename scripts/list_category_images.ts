import { createClient } from '@supabase/supabase-js';

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_PUBLISHABLE_KEY / SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY as string);

  const { data, error } = await supabase.from('categories').select('id,name,slug,image_url');
  if (error) {
    console.error('Supabase error:', error);
    process.exit(2);
  }

  console.table((data || []).map((r: any) => ({ id: r.id, name: r.name, slug: r.slug, image_url: r.image_url }))); 
}

main().catch((e) => { console.error(e); process.exit(99); });

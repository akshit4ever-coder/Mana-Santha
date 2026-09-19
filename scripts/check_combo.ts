import 'dotenv/config';

(async () => {
  try {
    const { supabaseAdmin } = await import('../src/integrations/supabase/client.server.ts');
    const nameQuery = 'నేటి తాజా కూరగాయల కాంబో';
    const { data, error } = await supabaseAdmin
      .from('combos')
      .select('id,name,status,date_valid_from,date_valid_to,price,offer_price,image_url,metadata,stock')
      .ilike('name', `%${nameQuery}%`)
      .limit(10);

    if (error) {
      console.error('DB query error:', error.message || error);
      process.exit(2);
    }

    console.log('Found combos:', (data || []).map(c => ({
      id: c.id,
      name: c.name,
      status: c.status,
      date_valid_from: c.date_valid_from,
      date_valid_to: c.date_valid_to,
      price: c.price,
      offer_price: c.offer_price,
      image_url: c.image_url ? '[set]' : null,
      stock: c.stock,
      metadata: c.metadata || {},
    })));
  } catch (err: any) {
    console.error('Script error:', err.message || err);
    process.exit(1);
  }
})();

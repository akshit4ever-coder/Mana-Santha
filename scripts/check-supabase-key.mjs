import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_KEY (service role key) in environment or .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

(async () => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Supabase key validation failed:', error.message || error);
      process.exit(2);
    }
    console.log('Supabase key valid — users count:', (data?.users || []).length);
  } catch (err) {
    console.error('Unexpected error validating Supabase key:', err);
    process.exit(99);
  }
})();

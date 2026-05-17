const { createClient } = require('@supabase/supabase-js');

// Anon key: respects RLS. Use only for public, unauthenticated reads.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

module.exports = supabase;

const { createClient } = require('@supabase/supabase-js');

// Service role key: bypasses RLS. Use only for authenticated server-side operations
// where authorization is enforced at the application layer.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

module.exports = supabaseAdmin;

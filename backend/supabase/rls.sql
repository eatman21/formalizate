-- ============================================================
-- FormalízaTe — Row Level Security policies
-- Run this in: Supabase Dashboard → SQL Editor → Run
--
-- Context: this app uses Firebase Auth, not Supabase Auth.
-- auth.uid() is therefore NOT available in policies.
-- RLS here enforces public vs. private data at the DB level.
-- All authenticated server-side operations use the service role
-- key (which bypasses RLS), with authorization enforced in
-- application code.
-- ============================================================

-- Enable RLS on all tables (default deny for anon role)
ALTER TABLE users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE formalization_steps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_step_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies            ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications         ENABLE ROW LEVEL SECURITY;

-- ── Public read: active vacancies only ───────────────────────
-- Anon users (and the anon-key backend client) may read active
-- vacancies. Closed/paused vacancies are invisible to the anon key.
DROP POLICY IF EXISTS "anon_read_active_vacancies" ON vacancies;
CREATE POLICY "anon_read_active_vacancies"
  ON vacancies
  FOR SELECT
  TO anon
  USING (status = 'active');

-- ── Public read: formalization steps ─────────────────────────
-- Reference data — fully public, no auth required.
DROP POLICY IF EXISTS "anon_read_formalization_steps" ON formalization_steps;
CREATE POLICY "anon_read_formalization_steps"
  ON formalization_steps
  FOR SELECT
  TO anon
  USING (true);

-- All other tables: no anon access (default deny).
-- users, user_step_progress, applications have no anon policies,
-- so they are fully inaccessible via the anon key.

-- ============================================================
-- FormalízaTe — PostgreSQL schema (Supabase)
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid    TEXT UNIQUE NOT NULL,
  email           TEXT NOT NULL,
  name            TEXT,
  role            TEXT NOT NULL DEFAULT 'worker'
                    CHECK (role IN ('worker', 'employer', 'admin')),
  phone           TEXT,
  city            TEXT DEFAULT 'Bogotá',
  document_type   TEXT DEFAULT 'CC'
                    CHECK (document_type IN ('CC', 'CE', 'PP', 'NIT')),
  document_number TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Formalization steps ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS formalization_steps (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index    INT  NOT NULL,
  title          TEXT NOT NULL,
  summary        TEXT NOT NULL,
  description    TEXT,
  entity         TEXT,          -- DIAN, Cámara de Comercio, SENA …
  requirements   TEXT[],
  link           TEXT,          -- official URL
  estimated_time TEXT,
  cost           TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── User progress per step ───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_step_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL,
  step_id      UUID NOT NULL REFERENCES formalization_steps(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'not_started'
                 CHECK (status IN ('not_started', 'in_progress', 'completed')),
  notes        TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (firebase_uid, step_id)
);

-- ── Vacancies ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vacancies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  salary        NUMERIC,
  city          TEXT NOT NULL DEFAULT 'Bogotá',
  category      TEXT NOT NULL,
  contract_type TEXT DEFAULT 'full_time'
                  CHECK (contract_type IN ('full_time','part_time','freelance','apprenticeship')),
  requirements  TEXT[],
  status        TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','closed','paused')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Applications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id   UUID NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','reviewed','accepted','rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (vacancy_id, applicant_id)
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid         ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_vacancies_employer_id      ON vacancies(employer_id);
CREATE INDEX IF NOT EXISTS idx_vacancies_status           ON vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_city             ON vacancies(city);
CREATE INDEX IF NOT EXISTS idx_vacancies_category         ON vacancies(category);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy_id    ON applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id  ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status        ON applications(status);
CREATE INDEX IF NOT EXISTS idx_progress_firebase_uid      ON user_step_progress(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_progress_step_id           ON user_step_progress(step_id);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at        ON users;
DROP TRIGGER IF EXISTS trg_vacancies_updated_at    ON vacancies;
DROP TRIGGER IF EXISTS trg_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS trg_progress_updated_at     ON user_step_progress;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_vacancies_updated_at
  BEFORE UPDATE ON vacancies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_progress_updated_at
  BEFORE UPDATE ON user_step_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Seed: formalization steps ────────────────────────────────
INSERT INTO formalization_steps
  (order_index, title, summary, description, entity, requirements, link, estimated_time, cost)
VALUES
(1,
 'Obtener el RUT',
 'Regístrate en la DIAN para obtener tu número tributario. Es gratuito y obligatorio.',
 'El Registro Único Tributario (RUT) identifica a personas y empresas ante la DIAN. Sin él no puedes expedir facturas, importar, exportar ni ejercer actividades económicas formalmente. El trámite es 100 % en línea.',
 'DIAN',
 ARRAY['Cédula de ciudadanía original','Correo electrónico activo','Número de celular'],
 'https://www.dian.gov.co/tramitesservicios/tramites_servicios/Paginas/Tramites-Servicios-Inscripcion-RUT.aspx',
 '1–2 días hábiles',
 'Gratuito'),

(2,
 'Registro mercantil en Cámara de Comercio',
 'Inscríbete si realizas actividades comerciales de forma profesional y habitual.',
 'La matrícula mercantil otorga personería jurídica, permite contratar con el Estado y da acceso a crédito empresarial. En Bogotá se tramita en la Cámara de Comercio de Bogotá (CCB). Puedes renovar cada año en enero.',
 'Cámara de Comercio',
 ARRAY['RUT vigente','Cédula de ciudadanía','Formulario de matrícula diligenciado','Pago de derechos según capital'],
 'https://www.ccb.org.co/Inscripciones-y-renovaciones/Registros-publicos/Registro-Mercantil',
 '3–5 días hábiles',
 'Desde $97.000 COP (escala por capital)'),

(3,
 'Afiliación a salud (EPS)',
 'Elige una EPS y afíliate al Sistema General de Seguridad Social en Salud.',
 'Todos los trabajadores dependientes e independientes deben estar afiliados a una EPS. El empleador afilia a sus empleados; los independientes se afilian directamente. La cotización equivale al 12,5 % del ingreso base.',
 'Ministerio de Salud',
 ARRAY['RUT o cédula','Formulario de afiliación de la EPS elegida','Si eres independiente: contrato o declaración de ingresos'],
 'https://www.minsalud.gov.co/proteccionsocial/Paginas/Sistema_General_Seguridad_Social_Salud.aspx',
 '1–3 días hábiles',
 '12,5 % del IBC (empleador 8,5 %, trabajador 4 %)'),

(4,
 'Afiliación a pensión (AFP o Colpensiones)',
 'Asegura tu futuro eligiendo un fondo de pensiones público o privado.',
 'Puedes afiliarte a Colpensiones (régimen de prima media) o a un fondo privado como Porvenir, Protección u Old Mutual (RAIS). La cotización es del 16 % del IBC. Cambiarte de régimen es posible bajo ciertas condiciones.',
 'Ministerio del Trabajo',
 ARRAY['Cédula de ciudadanía','Formulario de afiliación del fondo elegido'],
 'https://www.colpensiones.gov.co',
 '1–2 días hábiles',
 '16 % del IBC (empleador 12 %, trabajador 4 %)'),

(5,
 'Afiliación a riesgos laborales (ARL)',
 'Protégete ante accidentes de trabajo y enfermedades profesionales.',
 'La ARL cubre incapacidades, rehabilitación y muerte por accidente de trabajo. Los empleadores deben afiliar a todos sus trabajadores dependientes. Los independientes pueden afiliarse voluntariamente según el nivel de riesgo de su actividad (I al V).',
 'Ministerio del Trabajo',
 ARRAY['RUT','Cédula','Descripción del cargo y código CIIU de la actividad'],
 'https://www.mintrabajo.gov.co/relaciones-laborales/riesgos-laborales',
 '1–2 días hábiles',
 '0,52 % – 6,96 % del IBC según clase de riesgo'),

(6,
 'Registro en el SENA y capacitación',
 'Accede a formación gratuita para mejorar tu empleabilidad y productividad.',
 'El SENA ofrece más de 6.000 cursos gratuitos presenciales y virtuales en tecnología, gestión empresarial, idiomas, gastronomía y decenas de áreas más. La plataforma Sofía Plus permite inscribirse sin costo y obtener certificados con validez nacional.',
 'SENA',
 ARRAY['Cédula de ciudadanía','Correo electrónico activo'],
 'https://oferta.senasofiaplus.edu.co',
 'Inmediato (en línea)',
 'Gratuito')
ON CONFLICT DO NOTHING;

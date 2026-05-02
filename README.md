# FormalízaTe 🇨🇴

**Plataforma web para formalizar el empleo informal en Bogotá, Colombia.**

FormalízaTe conecta a trabajadores informales con los recursos, guías y oportunidades laborales que necesitan para acceder al sistema formal de empleo colombiano, incluyendo el proceso con la DIAN, Cámara de Comercio y la seguridad social.

---

## Características principales

- **Autenticación** con Firebase (correo/contraseña y Google)
- **Guía de formalización paso a paso** (RUT-DIAN, Cámara de Comercio, EPS, AFP, ARL, SENA)
- **Barra de progreso** para seguir el avance de cada usuario
- **Bolsa de empleo**: publicación y búsqueda de vacantes formales
- **Aplicación a vacantes** con carta de presentación
- **Panel de control** para trabajadores y empleadores
- **Roles diferenciados**: trabajador y empleador

---

## Tecnologías

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS        |
| Backend    | Node.js, Express                    |
| Base de datos | PostgreSQL vía Supabase          |
| Autenticación | Firebase Authentication          |
| Despliegue | Vercel (frontend + serverless API)  |

---

## Estructura del proyecto

```
formalizate/
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login y Registro
│   │   │   ├── common/        # Navbar, ProtectedRoute
│   │   │   ├── dashboard/     # Panel y barra de progreso
│   │   │   ├── formalization/ # Guía y detalle de pasos
│   │   │   ├── vacancies/     # Listado, tarjeta y publicación
│   │   │   └── applications/  # Formulario de aplicación
│   │   ├── context/           # AuthContext (Firebase)
│   │   ├── hooks/             # useAuth
│   │   ├── pages/             # Páginas de cada ruta
│   │   └── services/          # firebase.js y api.js (Axios)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                   # API REST con Express
│   ├── src/
│   │   ├── config/            # supabase.js y firebase.js
│   │   ├── middleware/        # authMiddleware.js (Firebase Admin)
│   │   ├── routes/            # users, steps, vacancies, applications
│   │   └── controllers/       # Lógica de negocio por recurso
│   ├── supabase/
│   │   └── schema.sql         # Esquema de base de datos + datos iniciales
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Instalación y configuración

### Prerrequisitos

- Node.js >= 18
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Proyecto en [Firebase](https://firebase.google.com) (gratuito)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/formalizate.git
cd formalizate
```

### 2. Configurar la base de datos en Supabase

1. Crea un nuevo proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `backend/supabase/schema.sql`
3. Copia las credenciales desde **Settings → API**

### 3. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Activa **Authentication** → habilita *Email/Password* y *Google*
3. Para el backend: genera una **clave privada** desde *Configuración del proyecto → Cuentas de servicio*

### 4. Variables de entorno

**Backend** — copia y completa `backend/.env.example` como `backend/.env`:

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
FIREBASE_PROJECT_ID=tu-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:5173
```

**Frontend** — copia y completa `frontend/.env.example` como `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef
VITE_API_URL=http://localhost:3001/api
```

### 5. Instalar dependencias y ejecutar

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## API REST

| Método | Ruta                              | Descripción                        | Auth requerida |
|--------|-----------------------------------|------------------------------------|----------------|
| GET    | /api/steps                        | Listar pasos de formalización       | No             |
| GET    | /api/steps/progress               | Progreso del usuario autenticado    | Sí             |
| PUT    | /api/steps/progress/:stepId       | Actualizar estado de un paso        | Sí             |
| GET    | /api/users/profile                | Obtener perfil del usuario          | Sí             |
| POST   | /api/users/profile                | Crear o actualizar perfil           | Sí             |
| GET    | /api/vacancies                    | Listar vacantes (con filtros)       | No             |
| GET    | /api/vacancies/:id                | Detalle de una vacante              | No             |
| POST   | /api/vacancies                    | Publicar vacante                    | Sí (empleador) |
| PUT    | /api/vacancies/:id                | Actualizar vacante                  | Sí (empleador) |
| DELETE | /api/vacancies/:id                | Cerrar vacante                      | Sí (empleador) |
| POST   | /api/applications                 | Aplicar a una vacante               | Sí (trabajador)|
| GET    | /api/applications/mine            | Ver mis aplicaciones                | Sí             |
| GET    | /api/applications/vacancy/:id     | Aplicaciones de una vacante         | Sí (empleador) |
| PUT    | /api/applications/:id/status      | Actualizar estado de aplicación     | Sí (empleador) |

---

## Despliegue en Vercel

### Frontend

```bash
cd frontend
npm run build
# Conectar el repositorio en vercel.com → configurar variables VITE_*
```

### Backend

Crea un archivo `vercel.json` en la raíz del backend:

```json
{
  "version": 2,
  "builds": [{ "src": "src/app.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/app.js" }]
}
```

Luego despliega el backend como proyecto separado en Vercel y actualiza `VITE_API_URL` con la URL asignada.

---

## Contribuir

1. Haz un fork del repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. Haz push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## Contexto social

Según el DANE, más del **55% de los trabajadores colombianos** están en la informalidad. En Bogotá, esto representa aproximadamente **2.7 millones de personas** que no tienen acceso a seguridad social, pensión ni protección laboral. FormalízaTe busca reducir esta brecha facilitando el proceso burocrático y conectando trabajadores con empleo digno.

---

## Licencia

MIT — Ver [LICENSE](LICENSE) para más detalles.

---

*Hecho con para los trabajadores de Colombia*

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';

const roleRoute = (role) => (role === 'employer' ? '/empleador' : '/panel');

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'worker', phone: '', city: 'Bogotá',
    document_type: 'CC', document_number: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 1. Create Firebase account
      await register(form.email, form.password);
      // 2. Save full profile to Supabase
      await authService.register(form);
      // 3. Navigate based on chosen role
      navigate(roleRoute(form.role));
    } catch (err) {
      const code = err.code || '';
      if (code.includes('email-already-in-use')) {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else if (code.includes('weak-password')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.response?.status === 409) {
        setError('Este usuario ya tiene una cuenta. Intenta iniciar sesión.');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      try {
        const { data: profile } = await authService.login();
        navigate(roleRoute(profile.role));
      } catch (profileErr) {
        if (profileErr.response?.status === 404) {
          await authService.register({
            name: result.user?.displayName || '',
            role: form.role,
          });
          navigate(roleRoute(form.role));
        } else {
          throw profileErr;
        }
      }
    } catch {
      setError('No se pudo registrar con Google.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'worker',   label: 'Trabajador',  desc: 'Busco empleo formal', icon: '👷' },
    { value: 'employer', label: 'Empleador',   desc: 'Quiero publicar vacantes', icon: '🏢' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="card w-full max-w-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
          <p className="text-gray-500 text-sm mt-1">Únete a FormalízaTe — gratuito y en español</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector — shown first to set context */}
          <div>
            <label className="label">Soy</label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    form.role === opt.value
                      ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-400'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio" name="role" value={opt.value}
                    checked={form.role === opt.value}
                    onChange={set('role')} className="sr-only"
                  />
                  <div className="text-xl mb-0.5">{opt.icon}</div>
                  <div className="font-semibold text-sm text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Nombre completo</label>
            <input type="text" required className="input" value={form.name} onChange={set('name')} placeholder="Juan Pérez García" />
          </div>

          <div>
            <label className="label">Correo electrónico</label>
            <input type="email" required className="input" value={form.email} onChange={set('email')} placeholder="tu@correo.com" />
          </div>

          <div>
            <label className="label">Contraseña</label>
            <input type="password" required minLength={6} className="input" value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Teléfono</label>
              <input type="tel" className="input" value={form.phone} onChange={set('phone')} placeholder="300 000 0000" />
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input className="input" value={form.city} onChange={set('city')} placeholder="Bogotá" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tipo de documento</label>
              <select className="input" value={form.document_type} onChange={set('document_type')}>
                <option value="CC">Cédula (CC)</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="PP">Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div>
              <label className="label">Número</label>
              <input className="input" value={form.document_number} onChange={set('document_number')} placeholder="1012345678" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-3 text-gray-400">o regístrate con</span></div>
        </div>

        <button
          onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <GoogleIcon />
          Continuar con Google
          {form.role === 'employer' && <span className="text-xs text-gray-400">(como empleador)</span>}
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

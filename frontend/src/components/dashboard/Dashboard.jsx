import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { stepService, applicationService } from '../../services/api';
import ProgressBar from './ProgressBar';

const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
const STATUS_LABELS = {
  pending: 'Pendiente', reviewed: 'En revisión',
  accepted: 'Aceptado', rejected: 'Rechazado',
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [steps, setSteps]            = useState([]);
  const [progress, setProgress]      = useState([]);
  const [applications, setApps]      = useState([]);
  const [loading, setLoading]        = useState(true);

  useEffect(() => {
    Promise.all([
      stepService.getAll(),
      stepService.getProgress(),
      applicationService.getMine(),
    ])
      .then(([stepsRes, progRes, appsRes]) => {
        setSteps(stepsRes.data || []);
        setProgress(progRes.data || []);
        setApps(appsRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed   = progress.filter((p) => p.status === 'completed').length;
  const inProgress  = progress.filter((p) => p.status === 'in_progress').length;
  const progressMap = Object.fromEntries(progress.map((p) => [p.step_id, p]));

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="card animate-pulse h-24 bg-gray-100" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Hola, {profile?.name?.split(' ')[0] || 'trabajador'} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
      </div>

      {/* Progress card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Tu progreso de formalización</h2>
          <Link to="/formalizacion" className="text-primary-600 text-sm hover:underline">Ver guía →</Link>
        </div>
        <ProgressBar completed={completed} total={steps.length} />
        {inProgress > 0 && (
          <p className="text-xs text-yellow-600 mt-2 font-medium">
            {inProgress} paso{inProgress > 1 ? 's' : ''} en progreso
          </p>
        )}

        {/* Step summary */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {steps.slice(0, 4).map((step, i) => {
            const s = progressMap[step.id]?.status || 'not_started';
            return (
              <div key={step.id} className="flex items-center gap-2 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  s === 'completed' ? 'bg-primary-600 text-white' :
                  s === 'in_progress' ? 'bg-yellow-400 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s === 'completed' ? '✓' : i + 1}
                </span>
                <span className={s === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <Link to="/formalizacion" className="btn-primary inline-block mt-4 text-sm">
          {completed === 0 ? 'Comenzar mi formalización' : 'Continuar guía'}
        </Link>
      </div>

      {/* Applications card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Mis aplicaciones recientes</h2>
          <Link to="/mis-aplicaciones" className="text-primary-600 text-sm hover:underline">Ver todas →</Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No has aplicado a ninguna vacante aún.</p>
            <Link to="/vacantes" className="btn-primary inline-block mt-3 text-sm">
              Explorar vacantes
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-800">{app.vacancies?.title}</p>
                  <p className="text-xs text-gray-500">{app.vacancies?.city} · {app.vacancies?.category}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
                  {STATUS_LABELS[app.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/vacantes" className="card text-center py-6 hover:shadow-md transition-shadow">
          <p className="text-2xl mb-1">💼</p>
          <p className="font-semibold text-gray-700 text-sm">Buscar empleo</p>
          <p className="text-xs text-gray-400 mt-0.5">Ver vacantes disponibles</p>
        </Link>
        <Link to="/formalizacion" className="card text-center py-6 hover:shadow-md transition-shadow">
          <p className="text-2xl mb-1">📋</p>
          <p className="font-semibold text-gray-700 text-sm">Formalizarme</p>
          <p className="text-xs text-gray-400 mt-0.5">Guía paso a paso</p>
        </Link>
      </div>
    </div>
  );
}

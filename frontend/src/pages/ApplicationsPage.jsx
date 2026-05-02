import { useEffect, useState } from 'react';
import { applicationService } from '../services/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  reviewed: 'En revisión',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService
      .getMine()
      .then((r) => setApplications(r.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis aplicaciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Seguimiento de tus postulaciones a vacantes de empleo
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">No has aplicado a ninguna vacante aún</p>
          <p className="text-gray-300 text-sm">
            Explora las vacantes disponibles y empieza a aplicar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {app.vacancies?.title || 'Vacante eliminada'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {app.vacancies?.city} · {app.vacancies?.category}
                </p>
                {app.vacancies?.salary && (
                  <p className="text-sm font-medium text-primary-600 mt-0.5">
                    ${Number(app.vacancies.salary).toLocaleString('es-CO')} / mes
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1.5">
                  Aplicado el{' '}
                  {new Date(app.created_at).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold ${STATUS_COLORS[app.status]}`}
              >
                {STATUS_LABELS[app.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

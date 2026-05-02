import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { vacancyService, applicationService } from '../../services/api';
import PostVacancy from '../vacancies/PostVacancy';

const STATUS_LABELS = { pending: 'Pendiente', reviewed: 'En revisión', accepted: 'Aceptado', rejected: 'Rechazado' };
const STATUS_COLORS = {
  pending:  'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
const CONTRACT_LABELS = {
  full_time: 'Tiempo completo', part_time: 'Medio tiempo',
  freelance: 'Independiente',   apprenticeship: 'Aprendizaje',
};
const VACANCY_STATUS_BADGE = {
  active: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
  paused: 'bg-yellow-100 text-yellow-700',
};

export default function EmployerDashboard() {
  const { profile } = useAuth();
  const [vacancies, setVacancies]     = useState([]);
  const [applications, setApplications] = useState({}); // { vacancyId: [] }
  const [loadingApps, setLoadingApps] = useState({});   // { vacancyId: bool }
  const [openId, setOpenId]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [closingId, setClosingId]     = useState(null);

  const loadVacancies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await vacancyService.getMine();
      setVacancies(data || []);
    } catch {
      setVacancies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadVacancies(); }, [loadVacancies]);

  const toggleVacancy = async (vacancyId) => {
    if (openId === vacancyId) { setOpenId(null); return; }
    setOpenId(vacancyId);
    if (applications[vacancyId]) return; // already loaded
    setLoadingApps((p) => ({ ...p, [vacancyId]: true }));
    try {
      const { data } = await applicationService.getForVacancy(vacancyId);
      setApplications((p) => ({ ...p, [vacancyId]: data || [] }));
    } catch {
      setApplications((p) => ({ ...p, [vacancyId]: [] }));
    } finally {
      setLoadingApps((p) => ({ ...p, [vacancyId]: false }));
    }
  };

  const handleStatusChange = async (applicationId, status, vacancyId) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      setApplications((p) => ({
        ...p,
        [vacancyId]: p[vacancyId].map((a) =>
          a.id === applicationId ? { ...a, status } : a
        ),
      }));
    } catch { /* ignore */ }
  };

  const handleCloseVacancy = async (vacancyId) => {
    setClosingId(vacancyId);
    try {
      await vacancyService.close(vacancyId);
      setVacancies((p) => p.map((v) => v.id === vacancyId ? { ...v, status: 'closed' } : v));
    } finally {
      setClosingId(null);
    }
  };

  const handleVacancyPosted = () => {
    setShowPostForm(false);
    loadVacancies();
  };

  // Stats derived from vacancies list
  const activeCount  = vacancies.filter((v) => v.status === 'active').length;
  const totalApps    = vacancies.reduce((s, v) => s + (v.applications?.[0]?.count ?? 0), 0);
  const acceptedApps = Object.values(applications)
    .flat()
    .filter((a) => a.status === 'accepted').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Empleador</h1>
          <p className="text-gray-500 text-sm mt-1">
            {profile?.name || profile?.email} · {profile?.city || 'Colombia'}
          </p>
        </div>
        <button
          onClick={() => setShowPostForm((s) => !s)}
          className={showPostForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showPostForm ? '← Cancelar' : '+ Publicar vacante'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Vacantes activas',  value: activeCount,  color: 'text-primary-600' },
          { label: 'Total aplicaciones', value: totalApps,    color: 'text-blue-600' },
          { label: 'Candidatos aceptados', value: acceptedApps, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="card text-center py-4">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Post form */}
      {showPostForm && (
        <PostVacancy onSuccess={handleVacancyPosted} />
      )}

      {/* Vacancies list */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Mis vacantes publicadas</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse h-24 bg-gray-100" />
            ))}
          </div>
        ) : vacancies.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-2xl mb-2">📋</p>
            <p className="text-gray-500 font-medium">Aún no has publicado vacantes.</p>
            <button
              onClick={() => setShowPostForm(true)}
              className="btn-primary mt-4 text-sm"
            >
              Publicar mi primera vacante
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {vacancies.map((vacancy) => {
              const appCount = vacancy.applications?.[0]?.count ?? 0;
              const isOpen   = openId === vacancy.id;
              const apps     = applications[vacancy.id] || [];

              return (
                <div key={vacancy.id} className={`card transition-shadow ${isOpen ? 'ring-1 ring-primary-200' : 'hover:shadow-md'}`}>
                  {/* Vacancy header */}
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">{vacancy.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${VACANCY_STATUS_BADGE[vacancy.status]}`}>
                          {vacancy.status === 'active' ? 'Activa' : vacancy.status === 'closed' ? 'Cerrada' : 'Pausada'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">📍 {vacancy.city}</span>
                        {vacancy.salary && (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">
                            ${Number(vacancy.salary).toLocaleString('es-CO')} / mes
                          </span>
                        )}
                        {vacancy.contract_type && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            {CONTRACT_LABELS[vacancy.contract_type]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleVacancy(vacancy.id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {appCount}
                        </span>
                        {appCount === 1 ? 'candidato' : 'candidatos'}
                        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
                      </button>

                      {vacancy.status === 'active' && (
                        <button
                          disabled={closingId === vacancy.id}
                          onClick={() => handleCloseVacancy(vacancy.id)}
                          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
                        >
                          {closingId === vacancy.id ? '…' : 'Cerrar'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Applicants accordion */}
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {loadingApps[vacancy.id] ? (
                        <div className="text-center py-6 text-gray-400 text-sm">Cargando candidatos…</div>
                      ) : apps.length === 0 ? (
                        <p className="text-center py-6 text-gray-400 text-sm">
                          Aún no hay aplicaciones para esta vacante.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {apps.map((app) => (
                            <ApplicantCard
                              key={app.id}
                              app={app}
                              vacancyId={vacancy.id}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicantCard({ app, vacancyId, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  const change = async (status) => {
    setUpdating(true);
    await onStatusChange(app.id, status, vacancyId);
    setUpdating(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-800">{app.users?.name || 'Sin nombre'}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status]}`}>
              {STATUS_LABELS[app.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{app.users?.email}</p>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
            {app.users?.phone && <span>📱 {app.users.phone}</span>}
            {app.users?.document_type && app.users?.document_number && (
              <span>{app.users.document_type} {app.users.document_number}</span>
            )}
            {app.users?.city && <span>📍 {app.users.city}</span>}
          </div>
          {app.cover_letter && (
            <blockquote className="mt-2 text-sm text-gray-600 italic border-l-2 border-primary-300 pl-3">
              "{app.cover_letter}"
            </blockquote>
          )}
          <p className="text-xs text-gray-400 mt-2">
            Aplicó el {new Date(app.created_at).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          {app.status !== 'accepted' && (
            <button
              disabled={updating}
              onClick={() => change('accepted')}
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors font-medium"
            >
              ✓ Aceptar
            </button>
          )}
          {app.status !== 'rejected' && (
            <button
              disabled={updating}
              onClick={() => change('rejected')}
              className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-40 transition-colors font-medium"
            >
              ✗ Rechazar
            </button>
          )}
          {app.status !== 'reviewed' && app.status === 'pending' && (
            <button
              disabled={updating}
              onClick={() => change('reviewed')}
              className="text-xs border border-blue-400 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 disabled:opacity-40 transition-colors font-medium"
            >
              Marcar revisado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

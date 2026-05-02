import { useState } from 'react';
import ApplicationForm from '../applications/ApplicationForm';

const CONTRACT_LABELS = {
  full_time: 'Tiempo completo',
  part_time: 'Medio tiempo',
  freelance: 'Independiente',
  apprenticeship: 'Aprendizaje',
};

export default function VacancyCard({ vacancy, showApply = true }) {
  const [applying, setApplying] = useState(false);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{vacancy.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {vacancy.users?.name || 'Empresa confidencial'}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {vacancy.category && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                {vacancy.category}
              </span>
            )}
            {vacancy.city && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                📍 {vacancy.city}
              </span>
            )}
            {vacancy.contract_type && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                {CONTRACT_LABELS[vacancy.contract_type] || vacancy.contract_type}
              </span>
            )}
          </div>
        </div>
        {vacancy.salary && (
          <div className="text-right shrink-0">
            <p className="text-primary-700 font-bold">
              ${Number(vacancy.salary).toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-gray-400">/ mes</p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{vacancy.description}</p>

      {vacancy.requirements?.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Requisitos:</p>
          <ul className="flex flex-wrap gap-1.5">
            {vacancy.requirements.slice(0, 3).map((r, i) => (
              <li key={i} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showApply && (
        <div className="mt-4">
          {applying ? (
            <ApplicationForm
              vacancyId={vacancy.id}
              onSuccess={() => setApplying(false)}
              onCancel={() => setApplying(false)}
            />
          ) : (
            <button onClick={() => setApplying(true)} className="btn-primary text-sm">
              Aplicar ahora
            </button>
          )}
        </div>
      )}
    </div>
  );
}

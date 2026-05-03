const STATUSES = [
  { value: 'not_started', label: 'No iniciado', color: 'bg-gray-100 text-gray-700' },
  { value: 'in_progress', label: 'En progreso', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-700' },
];

const STEP_VIDEOS = {
  'DIAN': {
    id: 'RVbImixXiEg',
    title: 'Cómo registrar el RUT en la DIAN',
  },
  'Cámara de Comercio': {
    id: 'gGSebn7wOVk',
    title: 'Cómo registrarse en la Cámara de Comercio',
  },
};

export default function StepDetail({ step, currentStatus, onUpdate }) {
  const video = STEP_VIDEOS[step.entity];

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción detallada</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
      </div>

      {video && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">🎬 Video tutorial</h4>
          <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {step.requirements?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Requisitos</h4>
          <ul className="space-y-1.5">
            {step.requirements.map((req, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-primary-500 mt-0.5 shrink-0">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {step.estimated_time && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Tiempo estimado:</span> {step.estimated_time}
        </p>
      )}

      {step.cost && (
        <p className="text-sm text-gray-500">
          <span className="font-medium">Costo aproximado:</span> {step.cost}
        </p>
      )}

      {step.link && (
        <a
          href={step.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline"
        >
          Ir al sitio oficial →
        </a>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Actualizar mi estado</h4>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => onUpdate(s.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                currentStatus === s.value
                  ? s.color + ' border-transparent ring-2 ring-offset-1 ring-primary-400'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

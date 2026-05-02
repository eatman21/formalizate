export default function ProgressBar({ completed, total, label }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {label || 'Progreso de formalización'}
        </span>
        <span className="text-sm font-bold text-primary-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-primary-700 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">
        {completed} de {total} pasos completados
      </p>
    </div>
  );
}

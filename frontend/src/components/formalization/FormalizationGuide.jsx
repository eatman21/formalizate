import { useEffect, useState } from 'react';
import { stepService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../dashboard/ProgressBar';
import StepDetail from './StepDetail';

const STATUS_ICONS = {
  completed: (
    <span className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
      ✓
    </span>
  ),
  in_progress: (
    <span className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
      ⟳
    </span>
  ),
  not_started: (
    <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold shrink-0">
      ○
    </span>
  ),
};

export default function FormalizationGuide() {
  const { user } = useAuth();
  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    stepService.getAll().then((r) => setSteps(r.data)).catch(() => {});
    if (user) {
      stepService.getProgress().then((r) => {
        const map = {};
        r.data.forEach((p) => { map[p.step_id] = p; });
        setProgress(map);
      }).catch(() => {});
    }
  }, [user]);

  const completed = Object.values(progress).filter((p) => p.status === 'completed').length;

  const handleUpdateProgress = async (stepId, status) => {
    await stepService.updateProgress(stepId, { status });
    setProgress((prev) => ({
      ...prev,
      [stepId]: { ...prev[stepId], step_id: stepId, status },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guía de Formalización</h1>
        <p className="text-gray-500 text-sm mt-1">
          Sigue estos pasos para formalizar tu empleo en Bogotá, Colombia
        </p>
      </div>

      {user && (
        <div className="card mb-6">
          <ProgressBar completed={completed} total={steps.length} />
        </div>
      )}

      <div className="space-y-3">
        {steps.map((step, i) => {
          const stepStatus = progress[step.id]?.status || 'not_started';
          const isOpen = selected === step.id;
          return (
            <div
              key={step.id}
              className={`card cursor-pointer transition-shadow hover:shadow-md ${
                isOpen ? 'border-primary-300 ring-1 ring-primary-200' : ''
              }`}
              onClick={() => setSelected(isOpen ? null : step.id)}
            >
              <div className="flex items-start gap-4">
                {STATUS_ICONS[stepStatus] || STATUS_ICONS.not_started}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400 font-medium">Paso {i + 1}</span>
                    {step.entity && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {step.entity}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mt-0.5">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{step.summary}</p>
                </div>
                <span className="text-gray-300 text-lg shrink-0">{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && user && (
                <div onClick={(e) => e.stopPropagation()}>
                  <StepDetail
                    step={step}
                    currentStatus={stepStatus}
                    onUpdate={(status) => handleUpdateProgress(step.id, status)}
                  />
                </div>
              )}
              {isOpen && !user && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ir al sitio oficial →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

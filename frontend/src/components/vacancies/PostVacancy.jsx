import { useState } from 'react';
import { vacancyService } from '../../services/api';

const CATEGORIES = ['Construcción', 'Comercio', 'Tecnología', 'Salud', 'Educación', 'Gastronomía', 'Transporte', 'Limpieza', 'Otro'];

export default function PostVacancy({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    salary: '',
    city: 'Bogotá',
    category: 'Comercio',
    requirements: '',
    contract_type: 'full_time',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await vacancyService.create({
        ...form,
        salary: form.salary ? Number(form.salary) : null,
        requirements: form.requirements.split('\n').filter(Boolean),
      });
      setSuccess(true);
      setTimeout(() => onSuccess?.(), 1500);
    } catch {
      setError('No se pudo publicar la vacante. Verifica que tu perfil de empleador esté completo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-10">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-semibold text-gray-800">¡Vacante publicada exitosamente!</p>
        <p className="text-sm text-gray-500 mt-1">Redirigiendo a la lista de vacantes...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Publicar vacante</h2>
      <p className="text-sm text-gray-500 mb-5">
        Conecta con trabajadores formalizados en Bogotá y otras ciudades
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Título del cargo *</label>
          <input
            required
            className="input"
            value={form.title}
            onChange={set('title')}
            placeholder="Ej: Auxiliar de cocina, Vendedor externo"
          />
        </div>

        <div>
          <label className="label">Descripción del cargo *</label>
          <textarea
            required
            rows={4}
            className="input"
            value={form.description}
            onChange={set('description')}
            placeholder="Describe las responsabilidades, horario, beneficios..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Salario mensual (COP)</label>
            <input
              type="number"
              min={0}
              className="input"
              value={form.salary}
              onChange={set('salary')}
              placeholder="1.300.000"
            />
          </div>
          <div>
            <label className="label">Ciudad *</label>
            <input required className="input" value={form.city} onChange={set('city')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Categoría</label>
            <select className="input" value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tipo de contrato</label>
            <select className="input" value={form.contract_type} onChange={set('contract_type')}>
              <option value="full_time">Tiempo completo</option>
              <option value="part_time">Medio tiempo</option>
              <option value="freelance">Independiente</option>
              <option value="apprenticeship">Aprendizaje</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Requisitos (uno por línea)</label>
          <textarea
            rows={3}
            className="input"
            value={form.requirements}
            onChange={set('requirements')}
            placeholder={`Bachillerato completo\n1 año de experiencia en el área\nDisponibilidad inmediata`}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Publicando...' : 'Publicar vacante'}
        </button>
      </form>
    </div>
  );
}

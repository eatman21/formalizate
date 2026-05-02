import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/api';

export default function ApplicationForm({ vacancyId, onSuccess, onCancel }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm mt-3">
        <p className="text-yellow-800">
          Debes{' '}
          <button
            className="font-semibold underline hover:text-yellow-900"
            onClick={() => navigate('/login')}
          >
            iniciar sesión
          </button>{' '}
          para aplicar a esta vacante.
        </p>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm mt-3 text-green-800 font-medium">
        ¡Aplicación enviada exitosamente! El empleador revisará tu perfil pronto.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await applicationService.apply({ vacancy_id: vacancyId, cover_letter: coverLetter });
      setSent(true);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar tu aplicación. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3 border-t border-gray-100 pt-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs">
          {error}
        </div>
      )}
      <div>
        <label className="label text-xs">Carta de presentación (opcional)</label>
        <textarea
          rows={3}
          className="input text-sm"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Cuéntanos por qué eres el candidato ideal para este cargo..."
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary text-sm">
          {loading ? 'Enviando...' : 'Enviar aplicación'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">
          Cancelar
        </button>
      </div>
    </form>
  );
}

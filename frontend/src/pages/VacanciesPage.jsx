import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VacancyList from '../components/vacancies/VacancyList';
import PostVacancy from '../components/vacancies/PostVacancy';

export default function VacanciesPage() {
  const { user } = useAuth();
  const [showPost, setShowPost] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vacantes disponibles</h1>
          <p className="text-gray-500 text-sm mt-1">
            Empleo formal en Bogotá y otras ciudades de Colombia
          </p>
        </div>
        {user && (
          <button
            onClick={() => setShowPost((p) => !p)}
            className={showPost ? 'btn-secondary text-sm' : 'btn-primary text-sm'}
          >
            {showPost ? '← Ver vacantes' : '+ Publicar vacante'}
          </button>
        )}
      </div>

      {showPost ? (
        <PostVacancy onSuccess={() => setShowPost(false)} />
      ) : (
        <VacancyList />
      )}
    </div>
  );
}

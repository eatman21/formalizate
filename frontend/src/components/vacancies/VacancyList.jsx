import { useEffect, useState } from 'react';
import { vacancyService } from '../../services/api';
import VacancyCard from './VacancyCard';

const CATEGORIES = ['Construcción', 'Comercio', 'Tecnología', 'Salud', 'Educación', 'Gastronomía', 'Transporte', 'Limpieza', 'Otro'];
const CITIES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

export default function VacancyList() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', city: '', page: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = { page: filters.page };
    if (filters.category) params.category = filters.category;
    if (filters.city) params.city = filters.city;
    vacancyService
      .getAll(params)
      .then((r) => {
        setVacancies(r.data.data || []);
        setTotal(r.data.total || 0);
      })
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (field) => (e) =>
    setFilters((p) => ({ ...p, [field]: e.target.value, page: 1 }));

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="input w-auto text-sm" value={filters.category} onChange={setFilter('category')}>
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input w-auto text-sm" value={filters.city} onChange={setFilter('city')}>
          <option value="">Todas las ciudades</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        {(filters.category || filters.city) && (
          <button
            className="text-sm text-gray-400 hover:text-gray-600 underline"
            onClick={() => setFilters({ category: '', city: '', page: 1 })}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : vacancies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No se encontraron vacantes con estos filtros.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {vacancies.map((v) => <VacancyCard key={v.id} vacancy={v} />)}
          </div>
          <div className="flex justify-between items-center pt-6">
            <p className="text-sm text-gray-500">{total} vacante{total !== 1 ? 's' : ''} en total</p>
            <div className="flex gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                className="btn-secondary text-sm py-1.5 disabled:opacity-40"
              >
                ← Anterior
              </button>
              <button
                disabled={filters.page * 10 >= total}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                className="btn-secondary text-sm py-1.5 disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

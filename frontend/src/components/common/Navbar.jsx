import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    close();
  };

  const isEmployer = profile?.role === 'employer';
  const navLinkCls = ({ isActive }) =>
    `hover:text-primary-600 transition-colors ${isActive ? 'text-primary-600 font-semibold' : ''}`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold text-primary-700 tracking-tight">FormalízaTe</span>
          <span className="hidden sm:inline text-xs bg-colombia-yellow text-gray-800 px-2 py-0.5 rounded-full font-semibold">
            Colombia
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <NavLink to="/vacantes" className={navLinkCls}>Vacantes</NavLink>
          {user && !isEmployer && (
            <>
              <NavLink to="/formalizacion" className={navLinkCls}>Guía de formalización</NavLink>
              <NavLink to="/panel" className={navLinkCls}>Mi panel</NavLink>
              <NavLink to="/mis-aplicaciones" className={navLinkCls}>Mis aplicaciones</NavLink>
            </>
          )}
          {user && isEmployer && (
            <NavLink to="/empleador" className={navLinkCls}>Panel empleador</NavLink>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-400 max-w-[160px] truncate">
                {profile?.name || user.email}
              </span>
              {profile && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isEmployer ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>
                  {isEmployer ? 'Empleador' : 'Trabajador'}
                </span>
              )}
              <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-1.5">Iniciar sesión</Link>
              <Link to="/registro" className="btn-primary text-sm py-1.5">Registrarme</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menú"
        >
          <div className="space-y-1">
            <span className="block w-5 h-0.5 bg-gray-600" />
            <span className="block w-5 h-0.5 bg-gray-600" />
            <span className="block w-5 h-0.5 bg-gray-600" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 text-sm font-medium">
          <NavLink to="/vacantes" onClick={close} className="block text-gray-700 hover:text-primary-600">Vacantes</NavLink>
          {user && !isEmployer && (
            <>
              <NavLink to="/formalizacion" onClick={close} className="block text-gray-700 hover:text-primary-600">Guía de formalización</NavLink>
              <NavLink to="/panel" onClick={close} className="block text-gray-700 hover:text-primary-600">Mi panel</NavLink>
              <NavLink to="/mis-aplicaciones" onClick={close} className="block text-gray-700 hover:text-primary-600">Mis aplicaciones</NavLink>
            </>
          )}
          {user && isEmployer && (
            <NavLink to="/empleador" onClick={close} className="block text-gray-700 hover:text-primary-600">Panel empleador</NavLink>
          )}
          {user ? (
            <button onClick={handleLogout} className="block text-red-500 hover:text-red-700">Cerrar sesión</button>
          ) : (
            <>
              <Link to="/login" onClick={close} className="block text-primary-600">Iniciar sesión</Link>
              <Link to="/registro" onClick={close} className="block text-primary-700 font-semibold">Registrarme</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

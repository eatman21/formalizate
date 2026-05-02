import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployerDashboardPage from './pages/EmployerDashboardPage';
import FormalizationPage from './pages/FormalizationPage';
import VacanciesPage from './pages/VacanciesPage';
import ApplicationsPage from './pages/ApplicationsPage';

// Redirects authenticated users to the right dashboard
function SmartRedirect() {
  const { user, profile } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={profile?.role === 'employer' ? '/empleador' : '/panel'} replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/dashboard" element={<SmartRedirect />} />

        {/* Worker routes */}
        <Route path="/panel" element={
          <ProtectedRoute role="worker"><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/formalizacion" element={
          <ProtectedRoute role="worker"><FormalizationPage /></ProtectedRoute>
        } />
        <Route path="/mis-aplicaciones" element={
          <ProtectedRoute role="worker"><ApplicationsPage /></ProtectedRoute>
        } />

        {/* Employer routes */}
        <Route path="/empleador" element={
          <ProtectedRoute role="employer"><EmployerDashboardPage /></ProtectedRoute>
        } />

        {/* Public */}
        <Route path="/vacantes" element={<VacanciesPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

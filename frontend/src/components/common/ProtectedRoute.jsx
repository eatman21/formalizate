import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, profile } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // If a specific role is required and we know the profile, enforce it
  if (role && profile && profile.role !== role) {
    return <Navigate to={profile.role === 'employer' ? '/empleador' : '/panel'} replace />;
  }

  return children;
}

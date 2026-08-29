import { Navigate } from 'react-router-dom';
import { getStoredUser } from '../api/auth';

export default function ProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem('token');
  const user = getStoredUser();
  const normalizedAllowedRole = String(allowedRole || '').toUpperCase();
  const normalizedUserRole = String(user.role || '').toUpperCase();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (normalizedAllowedRole && normalizedUserRole !== normalizedAllowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

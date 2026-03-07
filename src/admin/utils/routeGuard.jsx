// FIX: RouteGuard must return children properly to avoid blank screen (2024-12-19)
import { Navigate } from 'react-router-dom';
import { hasAuthToken } from '../../utils/authStorage.js';

export default function RouteGuard({ children }) {
  // Redirect to login if no token
  if (!hasAuthToken()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}


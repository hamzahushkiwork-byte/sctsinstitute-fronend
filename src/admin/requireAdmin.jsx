import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from './authStorage.js';

export default function RequireAdmin() {
  if (!getAccessToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}




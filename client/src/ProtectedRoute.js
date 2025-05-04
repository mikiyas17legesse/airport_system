import { useAuth } from './AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;

  // If a requiredRole is specified, check it
  if (requiredRole && user.role !== requiredRole) {
    // Optionally, redirect to a not-authorized page or home
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;

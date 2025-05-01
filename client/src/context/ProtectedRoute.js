import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />; 

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
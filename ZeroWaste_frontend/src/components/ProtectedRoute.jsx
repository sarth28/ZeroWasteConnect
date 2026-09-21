import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (allowedRole && user?.role !== allowedRole) {
    const dashboard =
      user?.role === 'NGO'
        ? '/ngo/dashboard'
        : '/restaurant/dashboard';

    return <Navigate to={dashboard} replace />;
  }

  return children;
}

export default ProtectedRoute;
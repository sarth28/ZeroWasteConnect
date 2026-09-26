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

  // If user role does not match required role, show Forbidden error page
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export default ProtectedRoute;
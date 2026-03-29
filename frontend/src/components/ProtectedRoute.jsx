import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Basic redirect if not allowed
    return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;

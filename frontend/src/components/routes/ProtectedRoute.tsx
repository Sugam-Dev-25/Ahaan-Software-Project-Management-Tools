import { Navigate, useParams } from 'react-router-dom';
import { type ReactNode } from 'react';
import { GlobalSpinner } from '../context/board/GlobalSpinner';

interface ProtectedRouteProps {
  user: any;
  children: ReactNode;
}

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  const { role } = useParams();

  if (!user) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  if (!user.role) {
    // Role not fetched yet
    return <GlobalSpinner />;
  }

  // Role mismatch → redirect to dashboard
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

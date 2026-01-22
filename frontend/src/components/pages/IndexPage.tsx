import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/app/hook';
import ProtectedRoute from '../routes/ProtectedRoute';
import { AdminDashboard } from '../dashboard/admin/AdminDashboard';
import {Auth} from '../redux/features/User/Auth';

export const IndexPage = () => {
  const { user } = useAppSelector((state) => state.login);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Auth />} />

      {/* Protected route: only accessible if user exists */}
      <Route
        path="/:role/dashboard/*"
        element={
          <ProtectedRoute user={user}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown paths */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

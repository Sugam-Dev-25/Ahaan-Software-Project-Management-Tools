import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/app/hook';

import { AdminDashboard } from '../dashboard/admin/AdminDashboard';
import {Auth} from '../redux/features/User/Auth';

export const IndexPage = () => {
  const user = useAppSelector(state => state.login.user);

  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route
        path="/:name/*"
        element={
          user?.name ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


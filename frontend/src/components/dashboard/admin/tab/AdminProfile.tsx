// src/components/dashboard/admin/tab/AdminProfile.tsx
import React from 'react';
import type { Profile } from '../profile';

interface DashboardContentProps {
  pendingProfiles: Profile[];
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

const AdminProfile: React.FC<DashboardContentProps> = ({
 
  pendingCount,
  approvedCount,
  rejectedCount,
}) => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">📊 Admin Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Welcome to the admin dashboard. Here is a summary of all user profile statuses.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-yellow-800">Pending Profiles</p>
          <p className="text-4xl font-bold text-yellow-700 mt-1">{pendingCount || 0}</p>
        </div>
        <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-green-800">Approved Profiles</p>
          <p className="text-4xl font-bold text-green-700 mt-1">{approvedCount || 0}</p>
        </div>
        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-red-800">Rejected Profiles</p>
          <p className="text-4xl font-bold text-red-700 mt-1">{rejectedCount || 0}</p>
        </div>
      </div>

      
     
    </div>
  );
};

export default AdminProfile;

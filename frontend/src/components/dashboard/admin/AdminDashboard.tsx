import React, { useEffect, useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import AdminSidebar from './tab/Sidebar';
import AdminProfile from './tab/AdminProfile';
import PendingProfiles from './tab/PendingProfiles';
import axiosClient from '../../api/axiosClient';
import AllProfiles from './tab/AllProfiles';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get('/admin/vidyaru-dashboard', { withCredentials: true });
      setDashboardData(res.data);
    };
    fetchData();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return <AdminProfile {...dashboardData} />;
      case "pending-profiles":
        return <PendingProfiles />;
      case "all":
        return <AllProfiles/>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout Sidebar={AdminSidebar} activeTab={activeTab} setActiveTab={setActiveTab}>
      {dashboardData ? renderTab() : <p>Loading...</p>}
    </DashboardLayout>
  );
};

export default AdminDashboard;

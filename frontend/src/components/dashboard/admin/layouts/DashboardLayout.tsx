// DashboardLayout.jsx
import React from 'react';

const DashboardLayout = ({ children, Sidebar, activeTab, setActiveTab }:{
  children: React.ReactNode;
  Sidebar: React.ComponentType<{
    activeTab: string;
    setActiveTab: (tab: string) => void;
  }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;

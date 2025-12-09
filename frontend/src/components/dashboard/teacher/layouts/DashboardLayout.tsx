import React from 'react';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Corresponds to the main structure in the EJS layout file
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {children}
    </div>
  );
};

export default DashboardLayout;
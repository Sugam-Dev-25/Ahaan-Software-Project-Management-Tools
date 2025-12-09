import { House, Books, Buildings, Files, NotePencil, SignOut } from '@phosphor-icons/react';
import React from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

// --- CONSTANTS ---
const PRIMARY_ACCENT = '#014063'; // Dark Navy (For inactive icons/text)
const ACTIVE_COLOR = '#1A9A7D'; // Teal Green (For active state background/text)

interface SidebarProps {
  currentPath: string;
  userId: string;
  profileStatus: string; // 'under_review', 'approved', 'rejected'
}

const navItems = [
  { name: 'Home', page: 'home', Icon: House },
  { name: 'Course', page: 'course', Icon: Books },
  { name: 'Libraries', page: 'libraries', Icon: Buildings },
  { name: 'Review', page: 'review', Icon: NotePencil },
  { name: 'Application', page: 'application', Icon: Files },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPath, userId, profileStatus }) => {
  const basePath = `/dashboard/${userId}`;

  const isActive = (page: string) => {
    // Adjusted logic to correctly check if the current path *starts* with the non-home paths, 
    // and ends with basePath for 'home'.
    const route = page === 'home' ? basePath : `${basePath}/${page}`;

    // Check for exact match for home, and startsWith for other pages to catch sub-routes
    if (page === 'home') {
      return currentPath.endsWith(basePath) && currentPath.split('/').length === basePath.split('/').length;
    }
    return currentPath.startsWith(route);
  };

  // Only show full nav if profile is approved
  const visibleNavItems = profileStatus === 'approved' ? navItems : [];

  const logout= async()=>{
    try{
      await axiosClient.post('/api/users/logout',{withCredentials: true} )
      return true
    }
    catch(err){
      console.error('something went wrong', err)
    }
  }

  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">
      <div className="flex flex-col items-center mb-8">
        {/* Logo styling adjusted for better visibility against white background */}
        <img
          src="/header-logo.png"
          alt="Logo"
          className="h-12 w-auto"
        />
      </div>

      <nav>
        {visibleNavItems.map(({ name, page, Icon }) => {
          const path = page === 'home' ? basePath : `${basePath}/${page}`;
          const active = isActive(page);

          return (
            <Link
              key={page}
              to={path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors mb-2 ${active
                  ? 'font-bold'
                  : 'hover:bg-gray-50'
                }`}
              style={{
                color: active ? ACTIVE_COLOR : PRIMARY_ACCENT,
                backgroundColor: active ? '#1a9a7d1a' : 'transparent', // Light tint of ACTIVE_COLOR for background
              }}
            >
              <Icon size={20} weight={active ? 'fill' : 'regular'} />
              {name}
            </Link>
          );
        })}

        <button
          
          onClick={async()=>{
            const success=await logout()
            if(success){
              window.location.href='/'
            }
            
          }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 mt-6"
          style={{ color: PRIMARY_ACCENT }}
        >
          <SignOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
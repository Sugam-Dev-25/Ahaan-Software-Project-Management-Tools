import React from 'react';
import { House, NotePencil, Files, SignOut } from '@phosphor-icons/react';
import axiosClient from '../../../api/axiosClient';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { name: 'Home', tab: 'home', Icon: House },
  { name: 'Pending Profiles', tab: 'pending-profiles', Icon: NotePencil },
  { name: 'All', tab: 'all', Icon: Files },
];

const logout=async()=>{
  try{
    await axiosClient.post('/api/users/logout', {withCredentials: true})
    return true
  }
  catch(error){
    console.error('something went wrong', error)
  }
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-60 bg-white p-6 shadow-xl h-screen sticky top-0">

      <div className="flex flex-col items-center mb-8">
        <img src="/header-logo.png" alt="Vidyaru" className="h-12 w-auto" />
      </div>

      <nav>
        {navItems.map(({ name, tab, Icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center gap-3 p-3 rounded-lg mb-2 text-left 
              ${activeTab === tab ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
            `}
          >
            <Icon size={20} weight={activeTab === tab ? 'fill' : 'regular'} />
            {name}
          </button>
        ))}

        <button
          onClick={async()=>{
            const success= await logout()
            if(success){
              window.location.href='/'
            }
          }}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 mt-6"
        >
          <SignOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

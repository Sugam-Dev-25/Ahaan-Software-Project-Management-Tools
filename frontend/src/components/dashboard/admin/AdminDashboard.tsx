
import { Sidebar } from './Sidebar'
import { Routes, Route, Navigate} from 'react-router-dom'
import {HomeTab} from './tabs/HomeTab'
import { GlobalSpinner } from '../../context/board/GlobalSpinner'

import { useAppSelector } from '../../redux/app/hook'
import { Topbar } from './TopBar'
import { TasksPageWrapper } from './TaskPagewrapper'
import { BoardQueryWrapper } from './BoardQueryWrapper'



export const AdminDashboard = () => {
  const user = useAppSelector(state => state.login.user);
  const role = user?.role;

  // Prevent rendering if the role hasn't loaded yet
  if (!role) return <GlobalSpinner />; 

  return (
    <div className='flex min-h-screen max-w-8xl mx-auto px-4 py-5 font-sans-serif'>
    
      <Sidebar/>

      <div className="flex-1 p-6">
        
         <Topbar/>
        <Routes>
          {/* Explicitly define the root for the dashboard */}
          <Route path="/" element={role ? <HomeTab /> : <GlobalSpinner />} /> 
          <Route path="project" element={<BoardQueryWrapper />} />
            <Route path="tasks" element={<TasksPageWrapper />} />
         
          <Route path="*" element={<Navigate to={`/`} replace />} />
        </Routes>
      </div>
    </div>
  );
};


import { Sidebar } from './Sidebar'
import { Routes, Route, useParams, Navigate} from 'react-router-dom'
import {HomeTab} from './tabs/HomeTab'

import { ProjectDetails } from './tabs/ProjectDetails'
import { BoardProvider } from '../../context/board/BoardProvider'
import { GlobalSpinner } from '../../context/board/GlobalSpinner'
import { MyTask } from './tabs/MyTask'
import { AllTask } from './tabs/AllTask'
import { useAppSelector } from '../../redux/app/hook'
import { Topbar } from './TopBar'
import { TasksPageWrapper } from './TaskPagewrapper'



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
          
            <Route path="tasks" element={<TasksPageWrapper />} />
          <Route path=":boardSlug" element={<BoardProviderWrapper />} />
          <Route path="*" element={<Navigate to={`/${role}/dashboard`} replace />} />
        </Routes>
      </div>
    </div>
  );
};

const BoardProviderWrapper = () => {
  const { boardSlug } = useParams();
  if (!boardSlug || boardSlug === "undefined") {
    return <HomeTab />;
  }
  return (
    <BoardProvider key={boardSlug}>
      <GlobalSpinner/>
      <ProjectDetails />
     
    </BoardProvider>
  );
};
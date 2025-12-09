
import { Routes, Route } from 'react-router-dom'
import './App.css'

import AdminDashboard from './components/dashboard/admin/AdminDashboard'
import TeacherDashboard from './components/dashboard/teacher/TeacherDashboard'




function App() {
 

  return (
    <Routes>
     
     <Route path="/admin/vidyaru-dashboard" element={<AdminDashboard />} />
     <Route path='/dashboard/:userId/*' element={<TeacherDashboard/>}/>
    </Routes>
  )
}

export default App

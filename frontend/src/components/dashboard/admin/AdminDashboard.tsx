
import { Sidebar } from './Sidebar'
import { Routes, Route } from 'react-router-dom'
import {HomeTab} from './tabs/HomeTab'
import { BoardTab } from './tabs/BoardTab'
import { MyBoardTab } from './tabs/MyBoardTab'
import { useAppDispatch, useAppSelector } from '../../redux/app/hook'
import { ProjectDetails } from './tabs/ProjectDetails'
import { slugify } from '../../hooks/slugify'

export const AdminDashboard = () => {
    const dispatch=useAppDispatch()
    const user= useAppSelector(state=>state.login.user)
    const role=user?.role
      const board=useAppSelector(state=>state.board.boards)
    const boardName=board?.map(b=>slugify(b.name))
    
  return (
    <div className='flex min-h-screen max-w-7xl mx-auto'>
        <Sidebar/>
        <div className="flex-1 p-6">
        <Routes>
            <Route path={`/${role}/dashboard`} element={<HomeTab/>}/>
            <Route path={`/${role}/dashboard/${boardName}`} element={<ProjectDetails/>}/>
            <Route path={`/${role}/dashboard/board`} element={<BoardTab/>}/>
            <Route path={`/${role}/dashboard/MyBoard`} element={<MyBoardTab/>}/>

        </Routes>
        </div>

    </div>
  )
}

import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { useEffect, useState } from "react"
import { fetchBoard } from "../../redux/features/Board/boardSlice"
import { slugify } from '../../hooks/slugify'
export const Sidebar = () => {
    const [selected, setSelected]=useState("")
    const base = "block text-center py-3 px-3"
    const active = "text-blue-600 border-l-4 border-blue-600 bg-blue-50"
    const inactive = "text-gray-500 hover:bg-gray-100"

    const dispatch=useAppDispatch();
    const user =useAppSelector(state=>state.login.user)
    const board=useAppSelector(state=>state.board.boards)
    const boardName=board?.map(b=>slugify(b.name))
    const role=user?.role
    useEffect(()=>{
        dispatch(fetchBoard())
    }, [dispatch])
  
    if(role==='admin' || role==='super-admin'){

    }
    return (
        <div className="w-40">
            <NavLink
                to={`/${role}/dashboard`}
                end
                className={({ isActive }) => `${base} ${isActive ? active : inactive} `}
            >
                Home
            </NavLink>
             <NavLink
                to={`/${role}/dashboard/${boardName}`}
                end
                className={({ isActive }) => `${base} ${isActive ? active : inactive} `}
            >
                 {boardName}
            </NavLink>
           
            <NavLink to={`/${role}/dashboard/board`}
                className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
                Board
            </NavLink>
            <NavLink to={`/${role}/dashboard/MyBoard`}
                className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
                My Board
            </NavLink>
        </div>
    )
}

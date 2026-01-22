import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { useEffect, useRef, useState } from "react"
import { fetchBoard } from "../../redux/features/Board/boardSlice"
import { slugify } from '../../hooks/slugify'
import { Plus } from "@phosphor-icons/react"
import { BoardTab } from "./tabs/BoardTab"
export const Sidebar = () => {
    const [showBoard, setShowBoard] = useState<boolean>(false);
    const [createBoard, setCreateBoard] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const base = "block  py-3 px-3"
    const active = "text-blue-600 border-l-4 border-blue-600 bg-blue-50"

    const inactive = "text-gray-500"

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.login.user)
    const board = useAppSelector(state => state.board.boards)

    const role = user?.role
    useEffect(() => {
        dispatch(fetchBoard())
    }, [dispatch])

    useEffect(() => {
        const handaleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {

                setCreateBoard(false)
            }
        }
        document.addEventListener("mousedown", handaleClickOutside)
        return () => document.removeEventListener("mousedown", handaleClickOutside)
    }, [])

    if (role === 'admin' || role === 'super-admin') {

    }
    return (
        <div className="w-40 relative px-3 py-6" >
            <NavLink
                to={`/${role}/dashboard`}
                end
                className={({ isActive }) => `${base} ${isActive ? active : inactive} `}
            >
                Home
            </NavLink>
            <NavLink to={`/${role}/dashboard/my-tasks`} className={({ isActive }) => `${base} ${isActive ? active : inactive} `}>
                {role === 'admin' || role === 'super-admin' ? "All tasks" : "My Tasks"}
            </NavLink>
            <div className="flex justify-between items-center" ref={dropdownRef}>
                <button
                    onClick={() => setShowBoard(true)}
                    className={`${base} ${inactive} `}
                >
                    Project Board
                </button>
                {(role === 'admin' || role === 'super-admin') &&
                    (<button onClick={() => setCreateBoard(true)} className="relative inline-block"><Plus /></button >)
                }
                {createBoard && (
                    <div className="absolute left-full top-15 ml-2 w-70 p-4 rounded-lg bg-gray-50 shadow-lg z-50" >
                        <BoardTab />
                    </div>
                )}
            </div>
            {showBoard && (
                <>
                    {board.map(b => {
                        const slug = slugify(b.name)
                        return (
                            <NavLink
                                to={`/${role}/dashboard/${slug}`}
                                end
                                className={({ isActive }) => `${"block py-1 px-2 gap-2 text-sm"} ${isActive ? "bg-gray-100 rounded-md " : "hover:rounded-md hover:bg-gray-100"} `}
                                key={b._id}
                            >
                                {b.name}
                            </NavLink>
                        )
                    })}
                </>
            )}

        </div>
    )
}

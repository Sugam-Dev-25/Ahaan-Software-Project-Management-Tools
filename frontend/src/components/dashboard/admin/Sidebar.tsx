import { NavLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../redux/app/hook"
import { useEffect, useState } from "react"
import { fetchBoard } from "../../redux/features/Board/boardSlice"
import { slugify } from '../../hooks/slugify'
import { Plus } from "@phosphor-icons/react"
import { BoardTab } from "./tabs/BoardTab"
export const Sidebar = () => {
    const [showBoard, setShowBoard] = useState<boolean>(false);
    const [createBoard, setCreateBoard] = useState<boolean>(false)
    const base = "block text-center py-3 px-3"
    const active = "text-blue-600 border-l-4 border-blue-600 bg-blue-50"
    const inactive = "text-gray-500 hover:bg-gray-100"

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.login.user)
    const board = useAppSelector(state => state.board.boards)
    const boardName = board?.map(b => slugify(b.name))
    const role = user?.role
    useEffect(() => {
        dispatch(fetchBoard())
    }, [dispatch])

    if (role === 'admin' || role === 'super-admin') {

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
            <div className="flex justify-between items-center"> <button
                onClick={() => setShowBoard(!showBoard)}
                className={`${base} ${inactive} `}
            >
                Project Board
            </button>
                <button onClick={() => setCreateBoard(!createBoard)} className="relative"><Plus /></button >
                {createBoard && (
                    <div className="absolute w-40 top-0">
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
                                className={({ isActive }) => `${base} ${isActive ? active : inactive} `}
                                key={b._id}
                            >
                                {b.name}
                            </NavLink>
                        )})}
                </>
            )}
        </div>
    )
}

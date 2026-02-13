import { NavLink, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/app/hook"
import { useEffect, useState } from "react"
import { fetchBoard } from "../redux/features/Board/boardSlice"
import { slugify } from '../hooks/slugify'
import {
    House,
    Kanban,
    Users,
    SignOut,
    Plus,
    CaretLeft,
    CaretRight,
    UserCirclePlus,
    ListChecks,
} from "@phosphor-icons/react";
import { logoutUser } from "../redux/features/User/login/loginSlice";
import { CreateBoardForm } from "../redux/features/Board/CreateBoardForm"
import AddUserModal from "../redux/features/User/AddUserModal"
interface SidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    const [showBoard, setShowBoard] = useState<boolean>(false);
    const [createBoard, setCreateBoard] = useState<boolean>(false)
    const [showAddUser, setShowAddUser] = useState(false);

    const navigate = useNavigate()
    const baseRow =
        "flex items-center h-11 px-4 text-sm rounded-md transition-all";
    const active = "bg-black text-white";
    const inactive = "text-black hover:bg-black hover:text-white";

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.login.user)
    const board = useAppSelector(state => state.board.boards)

    const role = user?.role || "user";
    const dashboardBase = `/${role}/dashboard`;
    useEffect(() => {
        dispatch(fetchBoard())
    }, [dispatch])



    const handleLogout = async () => {
        await dispatch(logoutUser()).unwrap();
        navigate("/", { replace: true });
    };

    if (role === 'admin' || role === 'super-admin') {

    }

    const onClose = () => {
        setCreateBoard(false)
    }
    return (
        < >
            <aside
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200
        ${collapsed ? "w-16" : "w-64"}
        transition-all duration-300 flex flex-col z-50`}
            >
                {/* LOGO */}
                <div className="h-14 flex items-center px-4">
                    <div
                        className={`text-black font-bold text-xl ${collapsed ? "mx-auto tracking-widest" : ""
                            }`}
                    >
                        {collapsed ? "ASC" : "Ahaan Software"}
                    </div>
                </div>
                <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
                    <NavLink
                        to={`${dashboardBase}`}
                        end
                        className={({ isActive }) => `${baseRow} ${isActive ? active : inactive} `}
                    >
                        <div
                            className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""
                                }`}
                        >
                            <House size={18} />
                            {!collapsed && "Home"}
                        </div>
                    </NavLink>
                    <NavLink to={`${dashboardBase}/tasks?scope=${(role === 'admin' || role === 'super-admin') ? 'all' : 'mine'}`}
                        className={({ isActive }) => `${baseRow} ${isActive ? active : inactive} `}>
                        <div
                            className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""
                                }`}
                        >
                            <ListChecks size={18} />
                            {!collapsed &&
                                (role === "admin" || role === "super-admin"
                                    ? "All Tasks"
                                    : "My Tasks")}
                        </div>
                    </NavLink>
                    <div className={`${baseRow} ${inactive}`} >
                        <button
                            onClick={() => setShowBoard((p) => !p)}
                            className="flex items-center gap-3 flex-1 text-left"
                        >
                            <Kanban size={18} />
                            {!collapsed && "Project"}
                        </button>
                        {!collapsed && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCreateBoard(true);
                                }}
                                className="p-1"
                            >
                                <Plus size={14} />
                            </button>
                        )}

                    </div>

                    {showBoard && !collapsed && (
                        <div className="ml-8 space-y-1">
                            {board.map(b => {
                                return (
                                    <NavLink
                                        key={b._id}
                                        to={`${dashboardBase}/${slugify(b.name)}`}
                                        className={({ isActive }) =>
                                            `block h-9 px-3 text-xs rounded-md flex items-center ${isActive
                                                ? "bg-black text-white"
                                                : "hover:bg-black hover:text-white"
                                            }`
                                        }
                                    >
                                        {b.name}
                                    </NavLink>
                                )
                            })}
                        </div>
                    )}
                    {role === "super-admin" && (
                        <button
                            onClick={() => setShowAddUser(true)}
                            className={`w-full ${baseRow} ${inactive}`}
                        >
                            <div
                                className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""
                                    }`}
                            >
                                <UserCirclePlus size={18} />
                                {!collapsed && "Create User"}
                            </div>
                        </button>
                    )}
                    <NavLink
                        to={`/${role}/dashboard/teams`}
                        className={({ isActive }) =>
                            `${baseRow} ${isActive ? active : inactive}`
                        }
                    >
                        <div
                            className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""
                                }`}
                        >
                            <Users size={18} />
                            {!collapsed && "Teams"}
                        </div>
                    </NavLink>
                    <button
                        onClick={() => setCollapsed((p) => !p)}
                        className="flex items-center h-11 w-full justify-center"
                    >
                        {collapsed ? <CaretRight /> : <CaretLeft />}
                    </button>
                </nav>
                <div className="p-3">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-black hover:text-red-600 transition"
                    >
                        <SignOut />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </aside>
            {createBoard && !collapsed && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center"
                    onClick={() => setCreateBoard(false)}
                >
                    <div className="absolute inset-0 bg-black/40" />

                    <div
                        className="relative w-[520px] bg-white rounded-2xl p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CreateBoardForm onClose={onClose} />
                    </div>
                </div>
            )}

            {showAddUser && (
                <AddUserModal onClose={() => setShowAddUser(false)} />
            )}
        </>
    )
}

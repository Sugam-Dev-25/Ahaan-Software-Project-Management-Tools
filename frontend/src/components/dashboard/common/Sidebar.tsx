// src/components/Sidebar.tsx (Final Version)

import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/features/User/login/loginSlice';
import { useAppDispatch, useAppSelector } from '../../redux/app/hook';
import { House, Users, PlusSquare, type IconProps, SignOut } from "@phosphor-icons/react";
import axiosClient from '../../api/axiosClient';

// --- 1. TYPE DEFINITIONS ---
interface NavLinkItem {
    to: string;
    label: string;
    icon: React.FC<IconProps>;
    group?: string;
    roles: string[]; // List of roles allowed to see this link
}

// --- 2. NAVIGATION DATA ---
const NAV_LINKS: NavLinkItem[] = [
    // All roles
    { to: "/dashboard", label: "My Boards", icon: House, roles: ['admin', 'super-admin', 'developer', 'member'] }, 
    
    // Admin Actions Group: Roles for Board Creation
    { to: "/admin/boards/new", label: "Create Project", icon: PlusSquare, group: "ADMIN ACTIONS", roles: ['admin', 'super-admin', 'developer'] },
    
    // Admin Actions Group: Roles for User Management
    { to: "/admin/users", label: "User Management", icon: Users, group: "ADMIN ACTIONS", roles: ['super-admin', 'developer'] }, 
];


const Sidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    
    // Fetch user and role from Redux store (populated after cookie/token check)
    const user = useAppSelector(state => state.login.user); 
    const role = user?.role;
    console.log(user?.role)
    
    // Filter links based on the current user's role
    const filteredLinks = NAV_LINKS.filter(link => 
        // Ensure role exists and check if the link's allowed roles include the user's role (lowercase for consistency)
        role && link.roles.includes(role.toLowerCase()) 
    );

    // --- 3. LOGOUT HANDLER (Server-side cookie clearing + local Redux clear) ---
    const handleLogout = async() => {
        try{
            // 1. Tell server to destroy session/clear HTTP-only cookie
            await axiosClient.post('/api/users/logout', {withCredentials: true});
            
            // 2. Clear local Redux state
            dispatch(logout()); 
            
            return true;
        }
        catch(err){
            console.error("Logout failed:", err);
            return false;
        }
    };

    // --- 4. GROUPING LOGIC ---
    // Groups links into 'MAIN' or their specified 'group' key (e.g., 'ADMIN ACTIONS')
    const groupedLinks = filteredLinks.reduce((acc, link) => {
        const groupKey = link.group || 'MAIN';
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(link);
        return acc;
    }, {} as Record<string, NavLinkItem[]>);


    // --- 5. RENDER UTILITY ---
    const renderLink = (link: NavLinkItem) => (
        <Link 
            key={link.to} 
            to={link.to} 
            className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
            <link.icon size={20} className="mr-3" /> {link.label}
        </Link>
    );

    // --- 6. RENDER COMPONENT ---
    return (
        <div className="w-64 flex flex-col p-4 bg-gray-800 text-white min-h-screen shadow-xl"> 
            
            {/* Header / Logo */}
            <h1 className="text-2xl font-extrabold mb-8 border-b border-gray-700 pb-3 text-[#feb238]">
                {role ? role.toUpperCase() : 'GUEST'} Portal
            </h1>
            
            
            <nav className="flex-grow space-y-4">
                {/* 1. Main Links */}
                {groupedLinks['MAIN']?.map(renderLink)}

                {/* 2. Grouped Links (e.g., Admin Actions) */}
                {groupedLinks['ADMIN ACTIONS'] && (
                    <div className="pt-4 border-t border-gray-700 mt-4 space-y-2">
                        <p className="text-sm font-semibold mb-2 text-gray-400 px-4">ADMIN ACTIONS</p>
                        {groupedLinks['ADMIN ACTIONS'].map(renderLink)}
                    </div>
                )}
            </nav>

            {/* Footer / Logout Section */}
            <div className="mt-auto pt-4 border-t border-gray-700">
                <div className="text-sm mb-2 text-gray-400">
                    Logged in as: <span className="font-semibold text-white">{user?.name || 'Unknown'}</span>
                </div>
                <button 
                    onClick={async()=>{
                        const success = await handleLogout();
                        if(success){
                            window.location.href='/' // Full page refresh redirect to login/home
                        }
                    }} 
                    className="w-full flex items-center justify-center py-2 bg-[#feb238] hover:bg-[#d69830] text-gray-800 font-semibold rounded transition duration-200"
                >
                    <SignOut size={20} className="mr-2"/> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
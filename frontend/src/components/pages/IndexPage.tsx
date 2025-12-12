// src/components/IndexPage.tsx (No changes needed, the logic is correct IF the hook works)

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/app/hook';
// This is the source of the fix
import ProtectedRoute from '../routes/ProtectedRoute';
import { AdminDashboard } from '../dashboard/admin/AdminDashboard';
import Auth from '../redux/features/User/Auth'
export const IndexPage = () => {

    const { user } = useAppSelector(state => state.login);
    return (
        <>
        <Routes>
            <Route path='/' element={<Auth/>}/>
        </Routes>


            <ProtectedRoute>
                <AdminDashboard />
            </ProtectedRoute>
        </>
    );
};
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useRoles from '../../Hooks/useRoles';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading: rolesLoading } = useRoles();

    // Show loading state while checking auth
    if (loading || rolesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-slate-600 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is logged in, redirect based on role
    if (user) {
        if (role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // User is not logged in, allow access to public pages
    return children;
};

export default PublicRoute;


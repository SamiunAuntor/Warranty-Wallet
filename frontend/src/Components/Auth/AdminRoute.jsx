import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import useRoles from '../../Hooks/useRoles';
import { showErrorAlert } from '../../Utils/alerts';

const AdminRoute = ({ children }) => {
    const { user, loading: authLoading, logoutUser } = useAuth();
    const axiosSecure = useAxios();
    const location = useLocation();
    const { role, isLoading: rolesLoading } = useRoles();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAdminAuthorization = async () => {
            // Wait for auth and roles to finish loading
            if (authLoading || rolesLoading) {
                return;
            }

            // If not logged in, redirect to login
            if (!user) {
                setIsAuthorized(false);
                setIsChecking(false);
                return;
            }

            // Verify admin access with backend
            try {
                const response = await axiosSecure.get('/api/users/me');
                const userData = response.data;

                // Check if user is suspended or deleted
                if (userData.status === 'suspended' || userData.status === 'deleted') {
                    await showErrorAlert(
                        'Account Suspended',
                        'Your account has been suspended. Please contact support.'
                    );
                    await logoutUser();
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Check if user is admin
                if (userData.role !== 'admin') {
                    await showErrorAlert(
                        'Admin Access Required',
                        'You do not have permission to access the admin panel. Unauthorized access attempt has been logged.'
                    );
                    // Log unauthorized access attempt
                    console.warn('Unauthorized admin access attempt:', {
                        email: userData.email,
                        role: userData.role,
                        path: location.pathname,
                        timestamp: new Date().toISOString(),
                    });
                    // Redirect to user dashboard
                    setIsAuthorized(false);
                    setIsChecking(false);
                    return;
                }

                // Verify admin access with backend admin endpoint (optional check)
                // If role is admin from /api/users/me, we trust it
                // Only deny if we get a 403 (explicit denial)
                try {
                    await axiosSecure.get('/api/admin/stats');
                    // If successful, user is authorized admin
                    setIsAuthorized(true);
                } catch (adminError) {
                    // Only deny access if we get 403 (explicit denial)
                    if (adminError.response?.status === 403) {
                        await showErrorAlert(
                            'Admin Access Denied',
                            'Your admin privileges have been revoked. Please contact support.'
                        );
                        await logoutUser();
                        setIsAuthorized(false);
                    } else {
                        // For other errors (500, network, etc.), trust the role check
                        // The role was already verified as 'admin' from /api/users/me
                        console.warn('Admin endpoint check failed, but role is admin. Allowing access:', adminError.response?.status || adminError.message);
                        setIsAuthorized(true);
                    }
                }
                setIsChecking(false);
            } catch (error) {
                console.error('Admin authorization check failed:', error);
                
                // If 401 or 403, user is not authorized
                if (error.response?.status === 401 || error.response?.status === 403) {
                    await showErrorAlert(
                        'Unauthorized Access',
                        'You are not authorized to access this page. Please log in again.'
                    );
                    await logoutUser();
                } else {
                    // Other errors - deny access for security
                    await showErrorAlert(
                        'Access Verification Failed',
                        'Unable to verify your access. Please try again or contact support.'
                    );
                }
                setIsAuthorized(false);
                setIsChecking(false);
            }
        };

        checkAdminAuthorization();
    }, [user, authLoading, rolesLoading, role, axiosSecure, logoutUser, location]);

    // Show loading state while checking
    if (authLoading || rolesLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-slate-600 text-sm font-medium">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Redirect to dashboard if not admin
    if (!isAuthorized) {
        return <Navigate to="/dashboard" replace />;
    }

    // Render admin content
    return children;
};

export default AdminRoute;


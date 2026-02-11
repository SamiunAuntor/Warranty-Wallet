import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import useAxios from '../../Hooks/useAxios';
import { showErrorAlert } from '../../Utils/alerts';

const PrivateRoute = ({ children }) => {
    const { user, loading: authLoading, logoutUser } = useAuth();
    const axiosSecure = useAxios();
    const location = useLocation();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthorization = async () => {
            // Wait for auth to finish loading
            if (authLoading) {
                return;
            }

            // If not logged in, redirect to login
            if (!user) {
                setIsAuthorized(false);
                setIsChecking(false);
                return;
            }

            // Verify user status with backend
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

                // User is authorized
                setIsAuthorized(true);
                setIsChecking(false);
            } catch (error) {
                console.error('Authorization check failed:', error);
                
                // If 401 or 403, user is not authorized
                if (error.response?.status === 401 || error.response?.status === 403) {
                    await showErrorAlert(
                        'Unauthorized Access',
                        'You are not authorized to access this page. Please log in again.'
                    );
                    await logoutUser();
                } else {
                    // Other errors - still allow access but log it
                    console.warn('Authorization check error, allowing access:', error);
                    setIsAuthorized(true);
                }
                setIsChecking(false);
            }
        };

        checkAuthorization();
    }, [user, authLoading, axiosSecure, logoutUser]);

    // Show loading state while checking
    if (authLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
                    <p className="text-slate-600 text-sm font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authorized
    if (!isAuthorized) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render protected content
    return children;
};

export default PrivateRoute;


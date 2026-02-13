import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import AdminLayout from "./Layouts/AdminLayout";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import AdminRoute from "./Components/Auth/AdminRoute";
import PublicRoute from "./Components/Auth/PublicRoute";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagement from "./Pages/UserManagement";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        children: [
            {
                index: true,
                element: <HomePage></HomePage>,
            },
            {
                path: "/login",
                element: (
                    <PublicRoute>
                        <LoginPage></LoginPage>
                    </PublicRoute>
                )
            },
            {
                path: "/register",
                element: (
                    <PublicRoute>
                        <Registration></Registration>
                    </PublicRoute>
                )
            },
            {
                path: "/reset-password",
                element: (
                    <PublicRoute>
                        <ResetPassword></ResetPassword>
                    </PublicRoute>
                )
            },
            {
                path: "/privacy",
                element: <Privacy />,
            },
            {
                path: "/terms",
                element: <Terms />,
            }
        ]

    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <DashboardLayout></DashboardLayout>
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard></Dashboard>,
            },
            {
                path: "/dashboard/products",
                element: <Products></Products>,
            },
            {
                path: "/dashboard/profile",
                element: <Profile></Profile>,
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayout></AdminLayout>
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <AdminDashboard></AdminDashboard>,
            },
            {
                path: "/admin/users",
                element: <UserManagement></UserManagement>,
            }
        ]
    }
]);

export default router;


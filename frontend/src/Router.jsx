import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import AdminLayout from "./Layouts/AdminLayout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Pages/AdminDashboard";
import UserManagement from "./Pages/UserManagement";

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
                element: <LoginPage></LoginPage>
            },
            {
                path: "/register",
                element: <Registration></Registration>
            },
            {
                path: "/reset-password",
                element: <ResetPassword></ResetPassword>
            }
        ]

    },
    {
        path: "/dashboard",
        element: <DashboardLayout></DashboardLayout>,
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
        element: <AdminLayout></AdminLayout>,
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


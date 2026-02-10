import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Profile from "./Pages/Profile";

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
                path: "products",
                element: <Products></Products>
            },
            {
                path: "profile",
                element: <Profile></Profile>
            }
        ]
    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>
    }
])

export default router;
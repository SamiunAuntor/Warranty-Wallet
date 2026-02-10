import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import Registration from "./Pages/Registration";
import Dashboard from "./Pages/Dashboard";

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
            }
        ]
    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>
    }
])

export default router;
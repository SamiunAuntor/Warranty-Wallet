import { createBrowserRouter, Navigate } from "react-router";
import HomeLayout from "./Layouts/HomeLayout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        children: [
            {
                index: true,
                element: <h1>Home Page</h1>,
            },
        ]

    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>
    }
])

export default router;
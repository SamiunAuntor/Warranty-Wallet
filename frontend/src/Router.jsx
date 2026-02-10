import { createBrowserRouter, Navigate } from "react-router";


const router = createBrowserRouter([
    {
        path: "/",
        element: <h1>Home Layout</h1>,
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
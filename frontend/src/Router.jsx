import { createBrowserRouter } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import PrivateRoute from "./Components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <div>Dashboard - Coming Soon</div>
      </PrivateRoute>
    ),
  },
]);

export default router;


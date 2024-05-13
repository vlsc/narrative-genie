import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Main from "./layout/Main";
import Error from "./pages/Error";
import Root from "./pages/Root";
import Worlds from "./pages/Worlds";
import Description from "./pages/Description";
import Profile from "./pages/Profile";
import Character from "./pages/Character";
import Place from "./pages/Place";
import ObjectPage from "./pages/Object";
import Login from "./pages/Login";
import ProtectedRoutes from "./pages/Routes/ProtectedRoutes";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: 
          <ProtectedRoutes>
            <Root />
          </ProtectedRoutes>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/worlds",
        element:
          <ProtectedRoutes>
            <Worlds />
          </ProtectedRoutes>,
      },
      {
        path: "/worlds/:id",
        element: 
          <ProtectedRoutes>
            <Description />
          </ProtectedRoutes>,
      },
      {
        path: "/profile",
        element: 
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>,
      },
      {
        path: "/characters/:id",
        element: 
          <ProtectedRoutes>
            <Character />
          </ProtectedRoutes>,
      },
      {
        path: "/places/:id",
        element: 
          <ProtectedRoutes>
            <Place />
          </ProtectedRoutes>,
      },
      {
        path: "/objects/:id",
        element: 
          <ProtectedRoutes>
            <ObjectPage />
          </ProtectedRoutes>,
      },
    ],
  },
  
]);

const Router: React.FC = () => <RouterProvider router={router} />;

export default Router;

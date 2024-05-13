import React from "react";
import Login from "../Login";


const ProtectedRoutes = ({children}: any) => {
    const authenticatedUser = localStorage.getItem("email") !== null && localStorage.getItem("email") !== undefined;

    return authenticatedUser ? children : <Login />;
}

export default ProtectedRoutes;
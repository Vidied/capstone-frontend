import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../app/store";
import type { Role } from "../interfaces/User";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ["ROLE_ADMIN"],
}) => {
  const { user, token } = useSelector((state: RootState) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user.roles.some((role: Role) => allowedRoles.includes(role));

  if (!hasRole) {
    return <Navigate to="/menu" replace />;
  }

  return <Outlet />;
};

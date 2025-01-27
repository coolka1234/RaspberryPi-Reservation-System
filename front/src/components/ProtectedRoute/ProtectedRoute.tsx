import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";
import type { UserRole } from "../../models/User";

interface ProtectedRouteProps extends PropsWithChildren {
  allowedRole?: UserRole;
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const user = useUser();
  const { pathname } = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: pathname }} />;
  }

  if (allowedRole != null && user.type !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export { ProtectedRoute };

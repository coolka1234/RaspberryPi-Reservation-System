import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";
import type { UserRole } from "../../models/User";

interface ProtectedRouteProps extends PropsWithChildren {
  allowedRole?: UserRole;
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const user = useUser();

  if (!user || (allowedRole != null && user.type !== allowedRole)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export { ProtectedRoute };

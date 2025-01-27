import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../contexts/AuthContext";

function ProtectedRoute({ children }: PropsWithChildren) {
  const user = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export { ProtectedRoute };

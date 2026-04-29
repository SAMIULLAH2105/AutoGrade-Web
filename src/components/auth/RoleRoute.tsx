import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { UserRole } from "@/state/AppContext";
import { useAuth } from "@/state/AppContext";

export function RoleRoute({
  children,
  allow,
}: {
  children: ReactNode;
  allow: UserRole[];
}) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user || !allow.includes(user.role)) {
    const fallback = user?.role === "teacher" ? "/teacher/upload-batch" : "/upload";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

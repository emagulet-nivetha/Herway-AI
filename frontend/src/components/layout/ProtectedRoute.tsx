import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/Feedback";

export function ProtectedRoute({ roles }: { roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = user.role === "member" ? "/dashboard" : "/cooperative";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
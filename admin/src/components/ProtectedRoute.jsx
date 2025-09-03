import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    // bounce to the correct home for *their* role
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/user/browse"} replace />;
  }

  return <Outlet />;
}

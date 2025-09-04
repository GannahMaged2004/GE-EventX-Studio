// This Component is used to protect routes based on user role
// It uses the useAuth hook to get the user and check if the user is authenticated and has the required role
// If the user is not authenticated, it redirects to the login page
// If the user does not have the required role, it redirects to the correct home page for their role
// If the user is authenticated and has the required role, it renders the protected route component
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

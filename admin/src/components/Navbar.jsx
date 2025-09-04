// Navbar
import { Link , useNavigate } from "react-router-dom";
import { LuTickets } from "react-icons/lu";
import { useAuth } from "../context/useAuth";


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const doLogout = () => {
    logout();
    navigate("/auth/login");
  };
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
     
        <Link to="/" className="text-2xl font-bold text-indigo-600">
        <LuTickets/>GEEventX 
        </Link>
{/* It'll only show the dashboard link if the user is an admin */}
        <div className="flex gap-6">
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="hover:text-indigo-600 font-medium">
              Dashboard
            </Link>
          )}
          <Link to="/user/browse" className="hover:text-indigo-600 font-medium">
            Events
          </Link>
          <Link to="/user/tickets" className="hover:text-indigo-600 font-medium">
            Tickets
          </Link>
          <Link to="/user/profile" className="hover:text-indigo-600 font-medium">
            Profile
          </Link>
      <button className= "  text-red-600 hover:text-red-900 font-bold " onClick={() => { logout(); navigate("/auth/login", { replace:true }); }}>
  Logout
</button>
        </div>

      </div>
    </nav>
  );
}

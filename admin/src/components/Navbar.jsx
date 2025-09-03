import { Link } from "react-router-dom";
import { LuTickets } from "react-icons/lu";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
        <LuTickets/>GEEventX 
        </Link>

        {/* Links */}
        <div className="flex gap-6">
          <Link to="/admin/dashboard" className="hover:text-indigo-600 font-medium">
            Dashboard
          </Link>
          <Link to="/user/browse" className="hover:text-indigo-600 font-medium">
            Events
          </Link>
          <Link to="/user/tickets" className="hover:text-indigo-600 font-medium">
            Tickets
          </Link>
        </div>

      </div>
    </nav>
  );
}

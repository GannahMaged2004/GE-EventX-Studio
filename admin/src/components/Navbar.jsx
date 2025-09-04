// Navbar
import { Link, useNavigate } from "react-router-dom";
import { LuTickets } from "react-icons/lu";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const doLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <LuTickets /> GEEventX
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
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
          <button
            className="text-red-600 hover:text-red-900 font-bold"
            onClick={doLogout}
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-2xl text-indigo-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 px-6 py-4 space-y-4">
          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="block hover:text-indigo-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/user/browse"
            className="block hover:text-indigo-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Events
          </Link>
          <Link
            to="/user/tickets"
            className="block hover:text-indigo-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Tickets
          </Link>
          <Link
            to="/user/profile"
            className="block hover:text-indigo-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            className="block w-full text-left text-red-600 hover:text-red-900 font-bold"
            onClick={() => {
              doLogout();
              setIsOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

// Login Page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { login as apiLogin } from "../../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../index.css";

// This function is used to render the login page
// It uses the useAuth and apiLogin functions from the context and api files respectively
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // This function is used to handle the change in the form
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

// The handleSubmit function is used to handle the form submission
// It first clears any previous errors, then tries to login using the apiLogin function
// If successful, it saves the user and token in the AuthProvider and redirects to the appropriate page
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  // clear previous errors
  try {
const res = await apiLogin(form);   
login(res);                         
navigate(res.role === "admin" ? "/admin/dashboard" : "/user/browse");

  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Login failed";
    setError(msg);
  }
};


// This is the login page

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg border border-gray-200 bg-purple-100">
        <h2 className="mb-6 text-center text-2xl font-bold text-purple-700">Login to EventX</h2>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" type="email" name="email" required value={form.email} onChange={handleChange}/>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2 pr-10"
              type={showPassword ? "text" : "password"} name="password" required value={form.password} onChange={handleChange}/>
            <button type="button" onClick={() => setShowPassword(p=>!p)} className="absolute right-3 top-9 text-gray-500">
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>
          </div>
          <button type="submit" className="w-full rounded-lg px-4 py-2 font-semibold text-white btn gradient-btn">Login</button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account? <Link to="/auth/register" className="font-medium text-indigo-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}

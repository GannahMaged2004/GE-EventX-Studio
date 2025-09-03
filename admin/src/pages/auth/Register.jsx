import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { register as apiRegister } from "../../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    role: "user", age: "", gender: "female", interests: "", location: ""
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null);
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    const payload = {
      ...form,
      interests: form.interests ? form.interests.split(",").map(s => s.trim()) : []
    };

    try {
      const { data } = await apiRegister(payload);
      login(data);
      navigate(data.role === "admin" ? "/admin/dashboard" : "/user/browse");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-purple-100 shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">Create Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-3 border rounded-xl" name="name" placeholder="Full Name" onChange={handleChange} required/>
          <input className="w-full p-3 border rounded-xl" type="email" name="email" placeholder="Email" onChange={handleChange} required/>

          <div className="relative">
            <input className="w-full p-3 border rounded-xl pr-10" type={showPwd ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required/>
            <button type="button" onClick={() => setShowPwd(p=>!p)} className="absolute right-3 top-3 text-gray-500">{showPwd ? <FaEyeSlash/> : <FaEye/>}</button>
          </div>

          <div className="relative">
            <input className="w-full p-3 border rounded-xl pr-10" type={showCPwd ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required/>
            <button type="button" onClick={() => setShowCPwd(p=>!p)} className="absolute right-3 top-3 text-gray-500">{showCPwd ? <FaEyeSlash/> : <FaEye/>}</button>
          </div>

          <select className="w-full p-3 border rounded-xl" name="role" value={form.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input className="w-full p-3 border rounded-xl" type="number" name="age" placeholder="Age" onChange={handleChange} required/>
          <select className="w-full p-3 border rounded-xl" name="gender" value={form.gender} onChange={handleChange}>
            <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
          </select>

          <input className="w-full p-3 border rounded-xl" name="interests" placeholder="Interests (comma separated)" onChange={handleChange}/>
          <input className="w-full p-3 border rounded-xl" name="location" placeholder="Location" onChange={handleChange} required/>

          <button type="submit" className="w-full btn gradient-btn text-white p-3 rounded-xl">Register</button>
        </form>
      </div>
    </div>
  );
}

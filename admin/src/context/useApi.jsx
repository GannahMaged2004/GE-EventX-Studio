// This file contains the code for the useApi hook, which is used to interact with the backend API.
import axios from "axios";
import { useAuth } from "./useAuth";

export function useApi() {
  const { user } = useAuth();

  const api = axios.create({
    baseURL: "http://localhost:5000/api", // adjust if your backend differs
  });

  // Add JWT token if user is logged in
  api.interceptors.request.use((config) => {
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });

  // === API methods ===
  const login = async (formData) => {
    const res = await api.post("/auth/login", formData);
    return res.data; // should include user + token from backend
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    return res.data;
  };

  return { api, login, register };
}

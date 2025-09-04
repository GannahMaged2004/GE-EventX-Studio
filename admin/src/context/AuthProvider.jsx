// This is the provider component that provides the auth context to its children components.
import { useState, useEffect, useCallback, useMemo } from "react";
import { AuthContext } from "./AuthContext";

function safeParse(value) {
  try {
    if (value == null) return null;
    const s = String(value).trim();
    if (!s || s === "undefined" || s === "null") return null;
    return JSON.parse(s);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => safeParse(localStorage.getItem("user")));
  const [token, setToken] = useState(() => {
    const raw = localStorage.getItem("token");
    return raw && raw !== "undefined" && raw !== "null" ? raw : null;
  });
  const [loading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = useCallback((data) => {
    // backend returns {_id, name, email, role, token}
    if (!data?.token) return;
    const { token: t, ...u } = data;
    setUser(u);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

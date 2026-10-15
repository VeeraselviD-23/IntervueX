import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "../services/authService";

const normalizeUserRole = (role) => {
  if (!role) return role;
  return role === "user" ? "jobseeker" : role;
};

const normalizeUser = (value) => {
  if (!value) return null;
  return {
    ...value,
    role: normalizeUserRole(value.role),
  };
};

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("intervuexUser"));
      return normalizeUser(storedUser);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("intervuexToken");
    if (!token) { setLoading(false); return; }
    getCurrentUser()
      .then(({ data }) => {
        const normalizedUser = normalizeUser(data.user || data);
        setUser(normalizedUser);
        localStorage.setItem("intervuexUser", JSON.stringify(normalizedUser));
      })
      .catch(() => {
        localStorage.removeItem("intervuexToken");
        localStorage.removeItem("intervuexUser");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (data) => {
    const normalizedUser = normalizeUser(data.user || data);
    localStorage.setItem("intervuexToken", data.token);
    localStorage.setItem("intervuexUser", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    return saveSession(data);
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    return saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("intervuexToken");
    localStorage.removeItem("intervuexUser");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>{children}</AuthContext.Provider>;
}

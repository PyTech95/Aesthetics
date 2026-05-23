import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Default to including credentials on all axios calls
axios.defaults.withCredentials = true;

const AuthContext = createContext({});

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export function AuthProvider({ children }) {
  // null = loading, false = unauthenticated, object = user
  const [user, setUser] = useState(null);

  const checkSession = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      setUser(data);
    } catch {
      setUser(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await axios.post(`${API}/auth/register`, payload);
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch {
      /* ignore */
    }
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refresh: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

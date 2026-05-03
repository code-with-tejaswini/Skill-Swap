import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_BASE =
  process.env.REACT_APP_API_URL || "https://skill-swap-s01i.onrender.com";

// Axios instance
export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("skillswap_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("skillswap_token");
      localStorage.removeItem("skillswap_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("skillswap_token");
    const storedUser = localStorage.getItem("skillswap_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("skillswap_token", data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("skillswap_token", data.token);
    localStorage.setItem("skillswap_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("skillswap_token");
    localStorage.removeItem("skillswap_user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("skillswap_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

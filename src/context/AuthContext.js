import React, { createContext, useState, useEffect } from "react";
import { loginAPI, registerAPI } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAPI(username, password);
      const { token, user } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (username, password, role = "consumer") => {
    setLoading(true);
    setError(null);
    try {
      await registerAPI(username, password, role);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useEffect, useState } from "react";
import { logoutUser, validateAccessToken } from "../api/authApi.js";
import Cookies from "js-cookie";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const validateToken = async () => {
    try {
      const response = await validateAccessToken();
      setUser(response.data.user);
      setLoggedIn(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error validating token:", error);
    }
  };

  const login = async (response) => {
    try {
      setLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {}
  };

  const logout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, user, loading, setUser, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

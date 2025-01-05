import React, { createContext, useEffect, useState } from "react";
import { validateAccessToken, logoutUser } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const validate = async () => {
    try {
      const response = await validateAccessToken(user);
      setLoggedIn(true);
      setUser(response.data.user);
    } catch (error) {
      //console.error("NEPRIHLASENY", error);
    }
  };

  useEffect(() => {
    validate();
  }, [loggedIn]);

  const login = async () => {
    validate();
  };

  const logout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

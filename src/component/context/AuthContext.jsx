import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const MASTER_KEY =
    "cb8d0be9c4f8c01e5d6a6273f3c9ab1467df9d8a75c248724105dbe3f1fd547a";
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    // خواندن رمز ذخیره‌شده بعد از رفرش
    const savedKey = localStorage.getItem("apiKey");
    if (savedKey && savedKey === MASTER_KEY) {
      setIsAuthenticated(true);
      setApiKey(savedKey);
    }
  }, []);

  const verifyKey = (inputKey) => {
    if (inputKey === MASTER_KEY) {
      setIsAuthenticated(true);
      setApiKey(inputKey);
      localStorage.setItem("apiKey", inputKey);
    } else {
      setIsAuthenticated(false);
      setApiKey("");
      localStorage.removeItem("apiKey");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setApiKey("");
    localStorage.removeItem("apiKey");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, verifyKey, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

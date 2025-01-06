"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of your user data
interface UserType {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  // Add other fields if needed
}

interface UserContextType {
  user: UserType | null;
  isLoggedIn: boolean;
  setUserAndLogin: (userData: UserType) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  setUserAndLogin: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // On mount, try to read user info from localStorage (if it exists)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // This function can be called after a successful login
  const setUserAndLogin = (userData: UserType) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Example logout
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, setUserAndLogin, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  return useContext(UserContext);
}

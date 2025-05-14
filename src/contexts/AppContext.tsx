"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { UserRole, AppContextType } from "@/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }
    
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  // Load role from localStorage on initial mount
  useEffect(() => {
    const storedRole = localStorage.getItem("appRole") as UserRole;
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Save role to localStorage whenever it changes
  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("appRole", newRole);
    } else {
      localStorage.removeItem("appRole");
    }
  };

  return (
    <AppContext.Provider value={{ role, setRole: handleSetRole, isOffline, setIsOffline, isLoading, setIsLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

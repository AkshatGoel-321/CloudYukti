/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  user: any; 
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
  }, [session]);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
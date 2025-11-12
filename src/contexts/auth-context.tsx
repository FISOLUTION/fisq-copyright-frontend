import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  basicAuthHeader: string | null;
  setBasicAuthHeader: (header: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [basicAuthHeader, setBasicAuthHeaderState] = useState<string | null>(
    null,
  );

  const setBasicAuthHeader = (header: string) => {
    setBasicAuthHeaderState(header);
  };

  const logout = () => {
    setBasicAuthHeaderState(null);
  };

  const isAuthenticated = basicAuthHeader !== null;

  return (
    <AuthContext.Provider
      value={{
        basicAuthHeader,
        setBasicAuthHeader,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authUtils } from "@/utils/auth";

interface AuthContextType {
  basicAuthHeader: string | null;
  userName: string | null;
  username: string | null;
  setBasicAuthHeader: (header: string) => void;
  setUserName: (name: string) => void;
  setUsername: (username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [basicAuthHeader, setBasicAuthHeaderState] = useState<string | null>(
    null,
  );
  const [userName, setUserNameState] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 로드 시 세션 스토리지에서 인증 정보 복원
  useEffect(() => {
    const storedHeader = authUtils.get();
    const storedUserName = authUtils.getUserName();
    const storedUsername = authUtils.getUsername();
    if (storedHeader) {
      setBasicAuthHeaderState(storedHeader);
    }
    if (storedUserName) {
      setUserNameState(storedUserName);
    }
    if (storedUsername) {
      setUsernameState(storedUsername);
    }
    setIsInitialized(true);
  }, []);

  const setBasicAuthHeader = (header: string) => {
    setBasicAuthHeaderState(header);
    authUtils.set(header);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    authUtils.setUserName(name);
  };

  const setUsername = (username: string) => {
    setUsernameState(username);
    authUtils.setUsername(username);
  };

  const logout = () => {
    setBasicAuthHeaderState(null);
    setUserNameState(null);
    setUsernameState(null);
    authUtils.remove();
    authUtils.removeUserName();
    authUtils.removeUsername();
  };

  const isAuthenticated = basicAuthHeader !== null;

  // 초기화되기 전에는 children을 렌더링하지 않음 (깜빡임 방지)
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        basicAuthHeader,
        userName,
        username,
        setBasicAuthHeader,
        setUserName,
        setUsername,
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

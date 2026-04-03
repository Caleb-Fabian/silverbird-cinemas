import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAdminAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAdminAuthenticated") === "true";
  });

  const login = () => {
    localStorage.setItem("isAdminAuthenticated", "true");
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
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

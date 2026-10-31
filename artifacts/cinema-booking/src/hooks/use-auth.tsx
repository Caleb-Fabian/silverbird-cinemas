import { createContext, useContext, useState, useEffect } from "react";
import { ADMIN_LOGOUT_EVENT, getAdminToken, setAdminToken } from "@/lib/api";

interface AuthContextType {
  isAdminAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    // Clean up the old flag from before logins were checked by the backend
    try { localStorage.removeItem("isAdminAuthenticated"); } catch { /* ignore */ }
    return Boolean(getAdminToken());
  });

  useEffect(() => {
    const onLogout = () => setIsAdminAuthenticated(false);
    window.addEventListener(ADMIN_LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(ADMIN_LOGOUT_EVENT, onLogout);
  }, []);

  const login = (token: string) => {
    setAdminToken(token);
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    setAdminToken(null);
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

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type User, authService } from "../services/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "user" | "admin",
    adminKey?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.data.user);
        }
      } catch (error: any) {
        // Handle session expiration
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      // Don't show toast here as it's handled in the Login component
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin" = "user",
    adminKey?: string,
  ) => {
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
        adminKey,
      });
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user state even if logout request fails
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

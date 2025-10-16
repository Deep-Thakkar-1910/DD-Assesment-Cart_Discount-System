import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    expiresIn: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  adminKey?: string;
}

export const authService = {
  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

import User, { IUser } from "../models/User";
import { generateTokens } from "../utils/jwtUtils";
import { config } from "../config/env";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  adminKey?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    expiresIn: string;
  };
}

/**
 * Register a new user
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const { name, email, password, role, adminKey } = data;

  // Admin key validation for admin role
  if (role === "admin") {
    const validAdminKey = config.adminKey;
    if (!adminKey || adminKey !== validAdminKey) {
      return {
        success: false,
        message:
          "Invalid admin key. Admin registration requires a valid admin key.",
      };
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      success: false,
      message: "User with this email already exists",
    };
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role,
  });

  await user.save();

  // Generate tokens
  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    },
  };
}

/**
 * Login user
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const { email, password } = data;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    success: true,
    message: "Login successful",
    data: {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
    },
  };
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(
  userId: string,
): Promise<{ success: boolean; data?: { user: IUser }; message?: string }> {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: { user },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error fetching user profile",
    };
  }
}

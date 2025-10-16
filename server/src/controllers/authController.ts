import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../services/authService";

/**
 * Register a new user
 */
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, role = "user", adminKey } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const result = await registerUser({
      name,
      email,
      password,
      role,
      adminKey,
    });

    if (!result.success) {
      const statusCode = result.message.includes("admin key") ? 403 : 409;
      return res.status(statusCode).json(result);
    }

    // Set httpOnly cookie
    res.cookie("token", result.data!.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({ email, password });

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set httpOnly cookie
    res.cookie("token", result.data!.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * Logout user
 */
export async function logout(req: Request, res: Response) {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
}

/**
 * Get current user profile
 */
export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();
    const result = await getUserProfile(userId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.data!.user._id,
          name: result.data!.user.name,
          email: result.data!.user.email,
          role: result.data!.user.role,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

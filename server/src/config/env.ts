import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/dd-assessment-cart",
  jwtSecret:
    process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  adminKey: process.env.ADMIN_KEY || "admin123",
};

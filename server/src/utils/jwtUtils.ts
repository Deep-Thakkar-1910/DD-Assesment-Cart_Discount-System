import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret!, {
    expiresIn: config.jwtExpiresIn!,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret!) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const generateTokens = (payload: JwtPayload) => {
  const accessToken = generateToken(payload);

  return {
    accessToken,
    expiresIn: "7d",
  };
};

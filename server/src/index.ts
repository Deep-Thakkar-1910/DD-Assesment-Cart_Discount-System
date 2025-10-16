import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/database";
import { config } from "./config/env";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

const app: Express = express();

// Connect to database
connectDB();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

// Global Error Handler middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  },
);

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});

export default app;

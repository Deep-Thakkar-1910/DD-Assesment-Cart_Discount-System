import mongoose from "mongoose";
import { config } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      config.mongodbUri || "mongodb://localhost:27017/dd-assessment-cart";

    const conn = await mongoose.connect(mongoURI);

    console.log(`🗄️  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

export default connectDB;

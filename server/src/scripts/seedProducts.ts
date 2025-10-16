import mongoose from "mongoose";
import connectDB from "../config/database";
import Product from "../models/Product";

const sampleProducts = [
  {
    name: "T-shirt",
    price: 20,
    category: "Clothing",
    stock: 100,
  },
  {
    name: "Jeans",
    price: 50,
    category: "Clothing",
    stock: 75,
  },
  {
    name: "Sneakers",
    price: 80,
    category: "Footwear",
    stock: 50,
  },
  {
    name: "Laptop",
    price: 999,
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Smartphone",
    price: 699,
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Coffee Mug",
    price: 12,
    category: "Home",
    stock: 200,
  },
  {
    name: "Book",
    price: 15,
    category: "Books",
    stock: 150,
  },
  {
    name: "Headphones",
    price: 120,
    category: "Electronics",
    stock: 60,
  },
];

async function seedProducts() {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();

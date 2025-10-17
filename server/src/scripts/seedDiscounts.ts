import mongoose from "mongoose";
import Discount from "../models/Discount";
import Product from "../models/Product";
import { config } from "../config/env";

async function seedDiscounts() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log("Connected to MongoDB");

    // Clear existing discounts
    await Discount.deleteMany({});
    console.log("Cleared existing discounts");

    // Get products for specific discounts
    const tshirt = await Product.findOne({ name: "T-shirt" });
    const sneakers = await Product.findOne({ name: "Sneakers" });

    const discounts = [
      {
        type: "BOGO",
        ruleType: "Buy 1 Get 1 Free",
        productId: tshirt?._id,
        discountValue: 100,
        minQuantity: 2,
        isActive: true,
      },
      {
        type: "BUY_X_FOR_Y",
        ruleType: "Buy 2 Sneakers for 1",
        productId: sneakers?._id,
        discountValue: 1,
        minQuantity: 2,
        payForQuantity: 1,
        isActive: true,
      },
      {
        type: "PERCENTAGE_OFF",
        ruleType: "50% Off on Clothing",
        category: "Clothing",
        discountValue: 50,
        isActive: true,
      },
    ];

    await Discount.insertMany(discounts);
    console.log("✅ Discounts seeded successfully!");
    console.log(`Created ${discounts.length} discount rules:`);
    discounts.forEach((d) => console.log(`  - ${d.ruleType}`));

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding discounts:", error);
    process.exit(1);
  }
}

seedDiscounts();

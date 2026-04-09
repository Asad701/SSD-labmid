import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ssd_lab";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const testUser = {
      userid: "ZAP-Test-User",
      fname: "ZAP",
      lname: "Tester",
      email: "zap-test@example.com",
      pwdhash: await bcrypt.hash("ZapTest123!", 10),
      country: "Testing"
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log("ZAP Test User already exists. Updating password...");
      await User.updateOne({ email: testUser.email }, { $set: { pwdhash: testUser.pwdhash } });
    } else {
      await User.create(testUser);
      console.log("ZAP Test User created successfully.");
    }

    await mongoose.disconnect();
    console.log("Seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();

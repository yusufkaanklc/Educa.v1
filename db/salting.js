import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dbConnect from "../db/dbConnect.js";

const createAdmin = async (username, email, password) => {
  try {
    await dbConnect(); // MongoDB'ye bağlantı sağla
    const users = await User.findOne({ email: email });
    if (users) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }
    const admin = new User({
      username,
      email,
      password,
      role: "superadmin",
    });

    await admin.save();
    console.log("Admin created successfully");

    // Bağlantıyı kapat
    mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

createAdmin(
  "superadmin",
  "superadmin@email.com",
  "12345Ab."
);

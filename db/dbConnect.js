import mongoose from "mongoose";
import dotenv from "dotenv";
import { config } from "dotenv";
dotenv.config();

export default async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

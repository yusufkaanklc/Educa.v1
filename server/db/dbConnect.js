import mongoose from "mongoose";

export default async function dbConnect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/education-app-db");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

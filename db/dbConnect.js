import mongoose from "mongoose";

export default async function dbConnect() {
  try {
    await mongoose.connect(
      "mongodb://admin:jFzgz50Hl0@45.136.6.18:27017/education-app-db"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

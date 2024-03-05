import mongoose, { Schema } from "mongoose";
import CourseStates from "./CourseStates.js";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "superadmin"],
    default: "student",
  },
  profession: {
    type: String,
  },
  image: {
    type: String,
  },
  courseStates: {
    type: Schema.Types.ObjectId,
    ref: "coursestates",
  },
  introduce: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("users", userSchema);

export default User;

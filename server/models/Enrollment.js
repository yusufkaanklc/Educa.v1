import mongoose, { Schema } from "mongoose";
import User from "./User.js";
import Course from "./Course.js";

const enrollmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "courses",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("enrollments", enrollmentSchema);

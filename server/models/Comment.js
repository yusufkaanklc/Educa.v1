import mongoose, { Schema } from "mongoose";
import User from "./User.js";
import Course from "./Course.js";

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("comments", commentSchema);

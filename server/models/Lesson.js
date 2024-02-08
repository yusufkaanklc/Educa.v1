import mongoose, { Schema } from "mongoose";
import Course from "./Course.js";

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
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

export default mongoose.model("lessons", lessonSchema);

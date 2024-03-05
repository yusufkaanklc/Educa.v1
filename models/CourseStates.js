import mongoose, { Schema } from "mongoose";
import User from "./User.js";
import Course from "./Course.js";
import Lesson from "./Lesson.js";

const courseStateSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  courseState: {
    type: Boolean,
    default: false,
  },
  lessonsStates: {
    type: [
      {
        lesson: {
          type: Schema.Types.ObjectId,
          ref: "lessons",
          required: true,
        },
        state: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },
});
const CourseStates = mongoose.model("courseStates", courseStateSchema);

export default CourseStates;

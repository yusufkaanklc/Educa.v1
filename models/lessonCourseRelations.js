import mongoose, { Schema } from "mongoose";
import Lesson from "./Lesson.js";
import Course from "./Course.js";

const lessonCourseRelationSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
  },
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "lessons",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LessonCourseRelation = mongoose.model(
  "lesson-course-relations",
  lessonCourseRelationSchema
);

export default LessonCourseRelation;

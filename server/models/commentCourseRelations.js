// Comment-Ders İlişkisi Model
import mongoose, { Schema } from "mongoose";
import Course from "./Course.js";
import Comment from "./Comment.js";

const commentCourseRelationSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentCourseRelation = mongoose.model(
  "CommentCourseRelation",
  commentCourseRelationSchema
);

export default CommentCourseRelation;

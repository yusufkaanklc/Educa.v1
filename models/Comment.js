import mongoose, { Schema } from "mongoose";
import User from "./User.js";

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  point: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4, 5],
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("comments", commentSchema);

export default Comment;

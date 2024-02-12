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

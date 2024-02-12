import mongoose, { Schema } from "mongoose";
import Category from "./Category.js";
import Comment from "./Comment.js";
import User from "./User.js";
import Lesson from "./Lesson.js";
import slugify from "slugify";

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  ownership: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  enrollments: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "lessons",
    },
  ],
  slug: {
    type: String,
  },
});

courseSchema.pre("validate", function (next) {
  // Slug değerini oluştur ve şemaya ata
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

const Course = mongoose.model("courses", courseSchema);

export default Course;

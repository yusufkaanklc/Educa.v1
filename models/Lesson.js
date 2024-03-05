import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import Comment from "./Comment.js";

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  duration: {
    type: Number,
  },
  notes: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
  },
});

lessonSchema.pre("validate", function (next) {
  // Slug değerini oluştur ve şemaya ata
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

const Lesson = mongoose.model("lessons", lessonSchema);

export default Lesson;

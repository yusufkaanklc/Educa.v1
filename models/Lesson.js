import mongoose, { Schema } from "mongoose";
import Course from "./Course.js";
import slugify from "slugify";

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

import mongoose, { Schema } from "mongoose";
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isFinished: {
    type: Boolean,
    default: false,
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

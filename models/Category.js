import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre("validate", function (next) {
  // Slug değerini oluştur ve şemaya ata
  this.slug = slugify(this.title, { lower: true, strict: true });
  // Middleware'den çık
  next();
});

const Category = mongoose.model("categories", categorySchema);

export default Category;

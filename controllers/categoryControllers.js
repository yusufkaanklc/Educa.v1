import Category from "../models/Category.js";
import errorHandling from "../middlewares/errorHandling.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories || categories.length === 0) {
      throw new Error("Categories not found");
    }
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      throw { code: 1, message: "Fields cannot be empty" };
    }
    const newCategory = new Category({
      title,
    });
    if (!newCategory) {
      throw { code: 2, message: "Category not created" };
    }
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateCategory = async (req, res) => {
  try {
    const categorySlug = req.params.categorySlug;
    const { title, description } = req.body;
    if (title === "" || description === "") {
      throw { code: 1, message: "Fields cannot be empty" };
    }

    const newSlug = slugify(title, { lower: true, strict: true });
    const category = await Category.findOneAndUpdate(
      { slug: categorySlug },
      {
        title,
        description,
        slug: newSlug,
      },
      { new: true }
    );
    if (!category) {
      throw { code: 2, message: "Category could not be updated" };
    }
    res.status(200).json({ "updated category :": category });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    const deleteCategory = await Category.findByIdAndDelete(category._id);
    if (!deleteCategory) {
      throw { code: 2, message: "Category could not be deleted" };
    }

    // Kategorisi, silinen kategoriyi referans alan kursların kategorilerini temizle
    const updateResult = await Course.updateMany(
      { category: category._id },
      { $unset: { category: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      throw { code: 2, message: "Category courses could not be deleted" };
    }

    res.status(200).json({
      message: "Category courses deleted successfully",
    });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

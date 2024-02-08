import Category from "../models/Category.js";
import Course from "../models/Course.js";

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
    const { title, description } = req.body;
    if (!title || !description) {
      throw new Error("Fields cannot be empty");
    }
    const newCategory = new Category({
      title,
      description,
    });
    if (!newCategory) {
      throw new Error("Category could not be created");
    }
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { title, description } = req.body;
    if (title === "" || description === "") {
      throw new Error("Fields cannot be empty");
    }
    const category = await Category.findByIdAndUpdate(categoryId, {
      title,
      description,
    });
    if (!category) {
      throw new Error("Category could not be updated");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      throw new Error("Category could not be deleted");
    }

    // Kategorisi silinen kategoriyi referans alan kursların kategorilerini temizle
    const updateResult = await Course.updateMany(
      { category: categoryId },
      { $unset: { category: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("No courses found with the given category");
    }

    res.status(200).json({
      message: "Category and associated courses deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

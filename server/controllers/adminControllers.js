import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { Types } from "mongoose";
import Ownership from "../models/Ownership.js";
import CommentCourseRelation from "../models/commentCourseRelations.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) throw new Error("Users not found");
    res.status(200).json({ "users :": users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    res.status(200).json({ "user : ": user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeUsers = async (req, res) => {
  try {
    const { userList } = req.body;
    if (!userList || userList.length === 0) {
      throw new Error("No user selected");
    }

    const deletedUserCount = [];

    for (const userId of userList) {
      // Kullanıcıya ait yorumları bulma
      const userComments = await Comment.find({ user: userId });

      // Kullanıcıya ait yorumların yanıtlarını bulma ve silme
      const replyIds = userComments.flatMap((comment) => comment.replies);
      await Comment.deleteMany({ _id: { $in: replyIds } });

      // Kullanıcıya ait yorumları silme
      await Comment.deleteMany({ user: userId });

      for (const userComment of userComments) {
        const commentCourseRelations = await CommentCourseRelation.findOne({
          comments: userComment._id,
        });

        let relationId = commentCourseRelations._id;

        await CommentCourseRelation.updateMany(
          { comments: userComment._id },
          { $pull: { comments: userComment._id } },
          { multi: true }
        );

        const findRelation = await CommentCourseRelation.findById(relationId);

        console.log(findRelation.comments.length);
        if (findRelation && findRelation.comments.length === 0) {
          await CommentCourseRelation.findByIdAndDelete(relationId);
        }
      }

      // Kullanıcıya ait enrollments'ları silme
      await Enrollment.deleteMany({ user: userId });

      // Kullanıcıya ait ownerships'ları silme
      await Ownership.deleteMany({ user: userId });

      // Kullanıcıyı silme
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        deletedUserCount.push(userId);
      }
    }

    if (deletedUserCount.length === 0) {
      throw new Error("No users could be deleted");
    }

    req.session.destroy();

    res
      .status(200)
      .json({ message: `${deletedUserCount.length} users deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
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
    const categorySlug = req.params.categorySlug;
    const { title, description } = req.body;
    if (title === "" || description === "") {
      throw new Error("Fields cannot be empty");
    }
    const category = await Category.findOneAndUpdate(
      { slug: categorySlug },
      {
        title,
        description,
      },
      { new: true }
    );
    if (!category) {
      throw new Error("Category could not be updated");
    }
    res.status(200).json({ "updated category :": category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const category = await Category.findOne({ slug: categorySlug });
    const deleteCategory = await Category.findByIdAndDelete(category._id);
    if (!deleteCategory) {
      throw new Error("Category could not be deleted");
    }

    // Kategorisi, silinen kategoriyi referans alan kursların kategorilerini temizle
    const updateResult = await Course.updateMany(
      { category: category._id },
      { $unset: { category: "" } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("No courses found with the given category");
    }

    res.status(200).json({
      message: "Category courses deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllUsers,
  getUser,
  removeUsers,
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

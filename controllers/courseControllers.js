import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Comment from "../models/Comment.js";
import slugify from "slugify";
import fs from "node:fs/promises";

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // Gelen verilerin boş olup olmadığını kontrol edin
    if (!title || !description || !price) {
      throw new Error("Fields cannot be empty");
    }

    // Yeni bir kurs oluşturun ve kaydedin
    const newCourseData = {
      title,
      description,
      price,
      ownership: req.session.userID,
    };

    if (category) newCourseData.category = category;
    if (req.uploadedImageUrl) newCourseData.imageUrl = req.uploadedImageUrl;

    const newCourse = new Course(newCourseData);
    await newCourse.save();

    // Başarılı yanıtı döndürün
    res.status(201).json({ message: "Created course", course: newCourse });
  } catch (error) {
    // Hata durumunda uygun bir hata yanıtı döndürün
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const categoryQuery = req.query.category;
    const titleQuery = req.query.title;
    let filter = {};

    const category = await Category.findOne({ slug: categoryQuery });

    if (category) {
      filter.category = category._id;
    }

    if (titleQuery) {
      const regexPattern = `${titleQuery}`;
      filter.title = { $regex: regexPattern, $options: "i" };
    }

    const courses = await Course.find(filter);

    if (!courses || courses.length === 0) {
      throw new Error("Courses not found");
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      throw new Error("Course not found");
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnedCourses = async (req, res) => {
  try {
    const ownership = await Ownership.findOne({
      user: req.session.userID,
    }).populate({ path: "courses", select: "title description" });
    if (!ownership) {
      throw new Error("Ownership not found");
    }
    res.status(200).json(ownership.courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const { title, description, category, imageUrl, price } = req.body;
    if (
      title === "" &&
      description === "" &&
      price === "" &&
      category === "" &&
      imageUrl === ""
    )
      throw new Error("fields cannot be empty");

    const newSlug = slugify(title, { lower: true, strict: true });
    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      {
        title,
        description,
        category,
        imageUrl,
        price,
        slug: newSlug,
      },
      { new: true }
    );
    if (!course) {
      throw new Error("Course could not be updated");
    }
    res.status(200).json({ message: "Course updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;

    const course = await Course.findOneAndDelete({ slug: courseSlug });
    if (!course) throw new Error("Course not found");

    if (course.imageUrl) {
      fs.unlink(course.imageUrl, (err) => {
        if (err) throw err;
      });
    }
    // Kursa ait yorumları al
    const comments = await Comment.find({ _id: { $in: course.comments } });

    // Her yorum için
    for (const comment of comments) {
      // Yorumu sil
      await Comment.findByIdAndDelete(comment._id);

      // Yoruma ait cevapları sil
      for (const replyId of comment.replies) {
        await Comment.findByIdAndDelete(replyId);
      }
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourse,
  getOwnedCourses,
  updateCourse,
  deleteCourse,
};

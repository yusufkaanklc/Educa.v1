import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Comment from "../models/Comment.js";
import slugify from "slugify";
import fs from "node:fs/promises";
import errorHandling from "../middlewares/errorHandling.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    // Gelen verilerin boş olup olmadığını kontrol edin
    if (!title || !description || !price)
      throw { code: 1, message: "Fields cannot be empty" };

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
    errorHandling(error, req, res);
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
      throw { code: 2, message: "Course not found" };
    }
    res.status(200).json(course);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getOwnedCourses = async (req, res) => {
  try {
    const ownership = await Course.find({ ownership: req.session.userID });
    if (!ownership || ownership.length === 0) {
      throw { code: 2, message: "Courses not found" };
    }
    res.status(200).json(ownership);
  } catch (error) {
    errorHandling(error, req, res);
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
      throw { code: 1, message: "Fields cannot be empty" };

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
      throw { code: 2, message: "Course couldnt be updated" };
    }
    res.status(200).json({ message: "Course updated" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;

    const course = await Course.findOneAndDelete({ slug: courseSlug });
    if (!course) throw { code: 2, message: "Course couldnt be deleted" };

    if (course.imageUrl) {
      fs.unlink(course.imageUrl, (err) => {
        if (err) throw { code: 2, message: "Course image couldnt be deleted" };
      });
    }
    // Kursa ait yorumları al
    const comments = await Comment.find({ _id: { $in: course.comments } });

    await Lesson.deleteMany({
      _id: { $in: course.lessons },
    });

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
    errorHandling(error, req, res);
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

import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Comment from "../models/Comment.js";
import slugify from "slugify";
import fs from "node:fs/promises";
import errorHandling from "../middlewares/errorHandling.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, point } = req.body;

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
    if (point) newCourseData.point = point;

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

    // const coursesWithAvgPoints = await Course.aggregate([
    //   {
    //     $match: filter,
    //   },
    //   {
    //     $lookup: {
    //       from: "lessons",
    //       localField: "lessons",
    //       foreignField: "_id",
    //       as: "lessonDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$lessonDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "comments",
    //       localField: "lessonDetails.comments",
    //       foreignField: "_id",
    //       as: "commentDetails",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$commentDetails",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "ownership",
    //       foreignField: "_id",
    //       as: "ownershipDetails",
    //     },
    //   },
    //   { $unwind: "$ownershipDetails" },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       title: { $first: "$title" },
    //       description: { $first: "$description" },
    //       ownership: { $first: "$ownershipDetails.username" },
    //       lessons: { $push: "$lessonDetails" },
    //       price: { $first: "$price" },
    //       point: {
    //         $avg: { $ifNull: ["$commentDetails.point", 1] },
    //       },
    //     },
    //   },
    // ]);

    const courses = await Course.find(filter).populate({
      path: "ownership",
      select: "username",
    });

    for (const course of courses) {
      let pointList = [];
      for (const lesson of course.lessons) {
        const lessonForComment = await Lesson.findById(lesson?._id);
        for (const comment of lessonForComment.comments) {
          const commentPoint = await Comment.findById(comment?._id);
          pointList.push(commentPoint?.point);
        }
      }
      if (pointList.length > 0) {
        await Course.findByIdAndUpdate(
          course._id,
          {
            point: Math.floor(
              pointList.reduce((a, b) => a + b) / pointList.length
            ),
          },
          { new: true }
        );
      }
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

    await Lesson.deleteMany({
      _id: { $in: course.lessons },
    });

    for (const lesson of course.lessons) {
      if (lesson.videoUrl && lesson.videoUrl !== "") {
        fs.unlink(lesson.videoUrl, (err) => {
          if (err)
            throw { code: 2, message: "Course video couldnt be deleted" };
        });
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

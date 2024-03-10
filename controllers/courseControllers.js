import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import slugify from "slugify";
import { unlink } from "fs/promises";
import fs from "fs";
import errorHandling from "../middlewares/errorHandling.js";
import CourseStates from "../models/CourseStates.js";

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
    res.status(201).json(newCourse);
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

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "ownership",
          foreignField: "_id",
          as: "ownershipDetails",
        },
      },
      {
        $unwind: {
          path: "$ownershipDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lessons",
          foreignField: "_id",
          as: "lessonDetails",
        },
      },
      { $unwind: { path: "$lessonDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          localField: "lessonDetails.comments",
          foreignField: "_id",
          as: "commentDetails",
        },
      },
      {
        $unwind: { path: "$commentDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "commentDetails.user",
          foreignField: "_id",
          as: "commentUserDetails",
        },
      },
      {
        $unwind: {
          path: "$commentUserDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          ownerName: { $first: "$ownershipDetails.username" },
          ownerId: { $first: "$ownershipDetails._id" },
          ownerImage: { $first: "$ownershipDetails.image" },
          enrollments: { $first: "$enrollments" },
          createdAt: { $first: "$createdAt" },
          lesson: { $first: "$lesson" },
          comments: {
            $addToSet: {
              $cond: [
                {
                  $gt: [
                    { $size: { $ifNull: ["$lessonDetails.comments", []] } },
                    0,
                  ],
                },
                {
                  $mergeObjects: [
                    "$commentDetails",
                    { user: "$commentUserDetails" },
                    { lesson: "$lessonDetails" },
                    { course: "$slug" },
                  ],
                },
                null,
              ],
            },
          },
          price: { $first: "$price" },
          lessons: { $addToSet: "$lessonDetails" },
          point: {
            $avg: {
              $cond: [
                { $isArray: "$lessonDetails.comments" },
                {
                  $cond: [
                    { $gt: [{ $size: "$lessonDetails.comments" }, 0] },
                    { $trunc: { $avg: "$commentDetails.point" } },
                    null,
                  ],
                },
                null,
              ],
            },
          },
          commentCount: {
            $sum: {
              $cond: [{ $ifNull: ["$commentDetails", false] }, 1, 0],
            },
          },
          duration: { $sum: "$lessonDetails.duration" },
          categoryTitle: { $first: "$categoryDetails.title" },
          categorySlug: { $first: "$categoryDetails.slug" },
          imageUrl: { $first: "$imageUrl" },
          slug: { $first: "$slug" },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const courses = await Course.aggregate(pipeline);

    for (const course of courses) {
      // Burada her bir belgeyi güncellemek için MongoDB sorgusu yapın

      await Course.updateOne(
        { _id: course._id },
        { $set: { point: course.point } },
        { new: true }
      );
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    // const course = await Course.findOne({ slug: courseSlug });
    const pipeline = [
      { $match: { slug: courseSlug } },
      {
        $lookup: {
          from: "lessons",
          localField: "lessons",
          foreignField: "_id",
          as: "lessonDetails",
        },
      },
      {
        $unwind: {
          path: "$lessonDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownership",
          foreignField: "_id",
          as: "ownershipDetails",
        },
      },
      {
        $unwind: {
          path: "$ownershipDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "enrollments",
          foreignField: "_id",
          as: "enrollmentsDetails",
        },
      },
      {
        $unwind: {
          path: "$enrollmentsDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          description: { $first: "$description" },
          ownerName: { $first: "$ownershipDetails.username" },
          ownerId: { $first: "$ownershipDetails._id" },
          ownerIntroduce: { $first: "$ownershipDetails.introduce" },
          ownerImage: { $first: "$ownershipDetails.image" },
          enrollments: { $addToSet: "$enrollmentsDetails" },
          duration: { $sum: "$lessonDetails.duration" },
          price: { $first: "$price" },
          lessons: { $addToSet: "$lessonDetails" },
          category: { $first: "$category" },
          imageUrl: { $first: "$imageUrl" },
          point: { $first: "$point" },
          duration: { $sum: "$lessonDetails.duration" },
          slug: { $first: "$slug" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          ownerName: 1,
          ownerId: 1,
          duration: 1,
          enrollments: 1,
          ownerIntroduce: 1,
          ownerImage: 1,
          price: 1,
          lessons: 1,
          category: 1,
          imageUrl: 1,
          point: 1,
          slug: 1,
        },
      },
    ];

    const course = await Course.aggregate(pipeline);

    if (course.length === 0) {
      throw { code: 2, message: "Course not found" };
    }
    res.status(200).json(course[0]);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const { title, description, price } = req.body;

    if (title === "" && description === "" && price === "")
      throw { code: 1, message: "Fields cannot be empty" };

    const newSlug = slugify(title, { lower: true, strict: true });

    let updateData = {};
    if (title !== "" && description) {
      updateData.title = title;
      updateData.slug = newSlug;
    }
    if (description !== "" && description) updateData.description = description;
    if (price !== "" && price) updateData.price = price;
    if (req.uploadedImageUrl) updateData.imageUrl = req.uploadedImageUrl;

    const beforeCourse = await Course.findOne({ slug: courseSlug });

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      updateData,
      { new: true }
    );

    if (!course) {
      throw { code: 2, message: "Course couldnt be updated" };
    }

    if (course.imageUrl && course.imageUrl !== beforeCourse.imageUrl) {
      if (fs.existsSync(beforeCourse.imageUrl)) {
        await unlink(beforeCourse.imageUrl);
      }
    }
    res.status(200).json({ message: "Course updated" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const findCourse = await Course.findOne({ slug: courseSlug });
    if (findCourse.enrollments.length > 0) {
      throw { code: 2, message: "Course has enrollment" };
    }

    await CourseStates.findOneAndDelete({
      course: findCourse._id,
    });

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
        if (fs.existsSync(lesson.videoUrl)) {
          fs.unlink(lesson.videoUrl, (err) => {
            if (err)
              throw { code: 2, message: "Course video couldnt be deleted" };
          });
        }
      }
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categoryName = req.query.categoryName;
    let filter = {};

    // Eğer categoryName parametresi varsa ve boş değilse filtreye ekle
    if (categoryName && categoryName.trim() !== "") {
      const regexPattern = new RegExp(categoryName, "i");
      filter.title = regexPattern;
    }

    const categories = await Category.find(filter);

    if (!categories || categories.length === 0) {
      throw { code: 2, message: "Category not found" };
    }

    res.status(200).json(categories);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateCourseOrLessonState = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { stateType } = req.query;

    if (stateType === "course") {
      const course = await Course.findOne({ slug: courseSlug });
      if (!course) throw { code: 2, message: "Course not found" };

      const setState = await CourseStates.findOneAndUpdate(
        { course: course._id, user: req.session.userID },
        { courseState: true },
        { new: true } // Güncellenmiş belgeyi döndür
      );

      if (setState) {
        res.status(200).json({ message: "Course state updated successfully" });
      } else {
        throw { code: 6, message: "Course state could not be updated" };
      }
    }

    if (stateType === "lesson") {
      const lesson = await Lesson.findOne({ slug: lessonSlug });
      if (!lesson) throw { code: 2, message: "Lesson not found" };

      const setState = await CourseStates.findOneAndUpdate(
        { user: req.session.userID, "lessonsStates.lesson": lesson._id },
        { $set: { "lessonsStates.$.state": true } },
        { new: true }
      );

      if (setState) {
        res.status(200).json({ message: "Lesson state updated successfully" });
      } else {
        throw { code: 6, message: "Lesson state could not be updated" };
      }
    }
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getCourseOrLessonState = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw { code: 2, message: "Course not found" };
    const findState = await CourseStates.findOne({
      course: course._id,
      user: req.session.userID,
    });
    if (!findState)
      throw { code: 2, message: "Course state relation not found" };

    res.status(200).json(findState);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getAllCategories,
  updateCourseOrLessonState,
  getCourseOrLessonState,
};

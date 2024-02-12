import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import Ownership from "../models/Ownership.js";
import LessonCourseRelation from "../models/lessonCourseRelations.js";
import CommentCourseRelation from "../models/commentCourseRelations.js";
import Comment from "../models/Comment.js";
import slugify from "slugify";

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const image = req.file; // multer tarafından yüklenen dosya

    console.log(title, description, category, image);

    // Gelen verilerin boş olup olmadığını kontrol edin
    if (!title || !description || !price) {
      throw new Error("Fields cannot be empty");
    }

    // Yeni bir kurs oluşturun ve kaydedin
    const newCourseData = {
      title,
      description,
      price,
    };

    if (category) newCourseData.category = category;
    if (image) {
      newCourseData.imageUrl = image.path;
    }

    const newCourse = new Course(newCourseData);
    await newCourse.save();

    // Kurs sahipliğini kontrol edin veya oluşturun
    let ownership = await Ownership.findOne({ user: req.session.userID });
    if (!ownership) {
      ownership = new Ownership({ user: req.session.userID, courses: [] });
    }

    // Kursu sahipliğe ekleyin ve kaydedin
    if (!ownership.courses.includes(newCourse._id)) {
      ownership.courses.push(newCourse._id);
      await ownership.save();
    } else {
      throw new Error("Ownership already exists");
    }

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

    const enrollment = await Enrollment.findOne({ courses: course._id });
    if (enrollment)
      throw new Error("Course has enrolled users, cannot be deleted");

    const lessonCourseRelation = await LessonCourseRelation.findOneAndDelete({
      course: course._id,
    });
    if (lessonCourseRelation)
      await Lesson.deleteMany({ _id: { $in: lessonCourseRelation.lessons } });

    const commentCourseRelation = await CommentCourseRelation.findOneAndDelete({
      course: course._id,
    });
    if (commentCourseRelation) {
      const repliesIds = commentCourseRelation.comments.flatMap(
        (comment) => comment.replies
      );
      await Comment.deleteMany({
        _id: { $in: repliesIds.concat(commentCourseRelation.comments) }, // burada comments ve replies birleştririlip toplu siliniyor
      });
    }

    const existingCourse = await Ownership.findOneAndUpdate(
      { courses: { $in: course._id } },
      { $pull: { courses: course._id } }
    );

    await Ownership.deleteOne({
      _id: existingCourse._id,
      courses: { $exists: true, $size: 0 },
    });

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

import User from "../models/User.js";
import Ownership from "../models/Ownership.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const ownershipControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const ownership = await Ownership.findOne({ user: req.session.userID });
    if (!ownership) {
      throw new Error("Unauthorized");
    }
    const course = await Course.findOne({ slug: courseSlug });
    if (!ownership.courses.includes(course._id)) {
      throw new Error("Course not found");
    }
    next(); // Hata yoksa next() kullanarak işlemi geçir
  } catch (error) {
    next(error); // Hata olursa next ile hatayı işleyin
  }
};

const enrollControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOne({ slug: courseSlug });
    const enrollment = await Enrollment.findOne({
      user: req.session.userID,
      courses: { $in: [course._id] },
    });
    if (!enrollment) {
      throw new Error("Unauthorized");
    }
    next(); // Hata yoksa next() kullanarak işlemi geçir
  } catch (error) {
    next(error); // Hata olursa next ile hatayı işleyin
  }
};

const ownershipAndEnrollControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOne({ slug: courseSlug });
    const ownership = await Ownership.findOne({
      user: req.session.userID,
      courses: { $in: [course._id] },
    });
    const enrollment = await Enrollment.findOne({
      user: req.session.userID,
      courses: { $in: [course._id] },
    });
    if (!ownership && !enrollment) {
      throw new Error("Unauthorized");
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  ownershipControl,
  enrollControl,
  ownershipAndEnrollControl,
};

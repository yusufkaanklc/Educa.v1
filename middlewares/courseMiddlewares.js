import User from "../models/User.js";
import Ownership from "../models/Ownership.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Comment from "../models/Comment.js";

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

const ownershipControlForCommentFunc = async (commentId, req, res, next) => {
  try {
    const comment = await Comment.findById(commentId);
    if (comment.user !== req.session.userId) throw new Error("Unauthorized");
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ownershipControlForComment = (req, res, next) => {
  const { commentId } = req.params;
  ownershipControlForCommentFunc(commentId, req, res, next);
};

const ownershipControlForReply = (req, res, next) => {
  const { replyId } = req.params;
  ownershipControlForCommentFunc(replyId, req, res, next);
};

export default {
  ownershipControl,
  enrollControl,
  ownershipAndEnrollControl,
  ownershipControlForReply,
  ownershipControlForComment,
};

import Course from "../models/Course.js";
import Comment from "../models/Comment.js";
import errorHandling from "./errorHandling.js";

// Ortak hata işleme fonksiyonu
// const handleError = (res, error) => {
//   const errorMessage = error.message || "Internal Server Error";
//   const statusCode = error.statusCode || 500;
//   res.status(statusCode).json({ message: errorMessage });
// };

// Kurs sahipliği kontrolü middleware'i
const ownershipControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const ownership = await Course.findOne({
      slug: courseSlug,
      ownership: req.session.userID,
    });
    if (!ownership) throw { message: "Unauthorized", code: 4 };

    next();
  } catch (error) {
    // handleError(res, error);
    errorHandling(error, req, res);
  }
};

// Kurs kaydı kontrolü middleware'i
const enrollControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const enrollment = await Course.findOne({
      slug: courseSlug,
      enrollments: req.session.userID,
    });
    if (!enrollment) throw { message: "Unauthorized", code: 4 };
    next();
  } catch (error) {
    errorHandling(error, req, res);
  }
};

// Kurs sahipliği ve kaydı kontrolü middleware'i
const ownershipAndEnrollControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const [ownership, enrollment] = await Promise.all([
      Course.findOne({ slug: courseSlug, ownership: req.session.userID }),
      Course.findOne({ slug: courseSlug, enrollments: req.session.userID }),
    ]);
    if (!ownership && !enrollment) throw { message: "Unauthorized", code: 4 };
    next();
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const ownershipControlForCommentFunc = async (
  commentId,
  courseSlug,
  req,
  res,
  next
) => {
  try {
    const comment = await Comment.findById(commentId);
    const course = await Course.findOne({ slug: courseSlug });

    if (
      comment.user.toString() !== req.session.userID.toString() &&
      course.ownership.toString() !== req.session.userID.toString()
    )
      throw { code: 4, message: "Unauthorized" };
    next();
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const ownershipControlForComment = (req, res, next) => {
  const { commentId, courseSlug } = req.params;
  ownershipControlForCommentFunc(commentId, courseSlug, req, res, next);
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

import errorHandling from "../middlewares/errorHandling.js";
import Comment from "../models/Comment.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

const addComment = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { text, point } = req.body;

    if (!text) {
      throw { code: 1, message: "Text cannot be empty" };
    }

    const lesson = await Lesson.findOne({ slug: lessonSlug });
    if (!lesson) {
      throw { code: 2, message: "Lesson not found" };
    }

    const newCommentData = {
      text,
      user: req.session.userID,
      point: parseInt(point, 10) || 1, // point'i sayıya dönüştür, başarısız olursa 1 kullan
    };

    const newComment = new Comment(newCommentData);
    await newComment.save();

    await Lesson.findOneAndUpdate(
      { slug: lessonSlug },
      { $push: { comments: newComment._id } }
    );

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      throw { code: 3, message: "Course not found" };
    }

    let coursePoint = course.point ? parseInt(course.point, 10) : 0; // course.point sayıya dönüştürülüyor, başarısız olursa 0 kullanılıyor
    let userPoint = newCommentData.point; // Kullanıcının verdiği puan
    let newCoursePoint = coursePoint
      ? Math.round((coursePoint + userPoint) / 2)
      : userPoint;

    await Course.findOneAndUpdate(
      { slug: courseSlug },
      { point: newCoursePoint },
      { new: true }
    );

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, point } = req.body;
    if (text === "") throw { code: 1, message: "Text cannot be empty" };
    const updateFields = {
      text: text,
    };
    if (point) {
      updateFields.point = point;
    }
    const comment = await Comment.findByIdAndUpdate(commentId, updateFields, {
      new: true,
    });
    if (!comment) throw { code: 2, message: "Comment could not be updated" };
    res.status(200).json(comment);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { lessonSlug, commentId } = req.params;

    // Dersi bul
    const course = await Lesson.findOneAndUpdate(
      { slug: lessonSlug },
      {
        $pull: { comments: commentId },
      }
    );
    if (!course) throw { code: 2, message: "Lesson could not be updated" };

    // Yorumu bul
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) throw { code: 2, message: "Comment could not be found" };

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default {
  addComment,
  updateComment,
  deleteComment,
};

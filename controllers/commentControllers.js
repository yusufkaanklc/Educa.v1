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
    };

    if (point) {
      newCommentData.point = point;
    } else {
      newCommentData.point = 1;
    }
    const newComment = new Comment(newCommentData);
    await newComment.save();

    await Lesson.findOneAndUpdate(
      { slug: lessonSlug },
      { $push: { comments: newComment._id } }
    );

    const course = await Course.findOne({
      slug: courseSlug,
      lessons: lesson._id,
    });
    if (!course) {
      throw { code: 3, message: "Course not found" };
    }

    if (point && course.point) {
      const newCoursePoint = Math.ceil((course.point + point) / 2);
      await Course.findOneAndUpdate(
        { slug: courseSlug },
        { point: newCoursePoint },
        { new: true }
      );
    } else {
      const newCoursePoint = Math.ceil((course.point + 1) / 2);
      await Course.findOneAndUpdate(
        { slug: courseSlug },
        { point: newCoursePoint },
        { new: true }
      );
    }

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

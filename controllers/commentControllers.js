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

    if (point !== NaN) {
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

    const newCoursePoint = Math.ceil((course.point + point) / 2);
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

const getComments = async (req, res) => {
  try {
    const { lessonSlug } = req.params;
    const lesson = await Lesson.findOne({ slug: lessonSlug });

    const commentList = [];
    for (const commentId of lesson.comments) {
      const comment = await Comment.findById(commentId);
      if (comment) {
        commentList.push(comment);
      }
    }

    if (commentList.length === 0) throw { code: 2, message: "No comments" };

    res.status(200).json(commentList);
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
    const comment = await Comment.findById(commentId);
    if (!comment) throw { code: 2, message: "Comment could not be found" };

    // Yanıtları sil
    const replies = comment.replies;
    for (const replyId of replies) {
      await Comment.findByIdAndDelete(replyId);
    }

    // Yorumu sil
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (text === "") throw { code: 1, message: "Text cannot be empty" };
    const newReply = new Comment({
      text,
      user: req.session.userID,
    });
    if (!newReply) throw { code: 2, message: "Reply could not be created" };
    await newReply.save();
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: newReply._id,
        },
      },
      {
        new: true,
      }
    );
    if (!comment) throw { code: 2, message: "Comment could not be updated" };
    res.status(200).json({ message: "Reply created successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) throw { code: 2, message: "Comment not found" };

    const replies = [];
    for (const replyId of comment.replies) {
      const reply = await Comment.findById(replyId);
      if (reply) {
        replies.push({
          text: reply.text,
          user: reply.user,
        });
      }
    }

    res.status(200).json({ replies });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { text } = req.body;
    if (text === "") throw { code: 1, message: "Text cannot be empty" };
    const reply = await Comment.findByIdAndUpdate(
      replyId,
      { text },
      { new: true }
    );
    if (!reply) throw { code: 2, message: "Reply could not be updated" };

    res.status(200).json({ message: "Reply updated successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    // Yanıtı bul ve sil
    const reply = await Comment.findByIdAndDelete(replyId);
    if (!reply) throw { code: 2, message: "Reply could not be found" };

    // Yanıta sahip yorumu bul ve yanıtı çıkar
    const comment = await Comment.findOneAndUpdate(
      { replies: replyId },
      { $pull: { replies: replyId } },
      { new: true } // Güncellenmiş belgeyi döndürmek için { new: true } kullanın
    );

    if (!comment) throw { code: 2, message: "Comment could not be updated" };

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  addReply,
  getReplies,
  updateReply,
  deleteReply,
};

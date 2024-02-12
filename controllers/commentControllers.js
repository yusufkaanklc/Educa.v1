import Comment from "../models/Comment.js";
import Course from "../models/Course.js";

const addComment = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const { text } = req.body;
    if (text === "") throw new Error("Text cannot be empty");
    const newComment = new Comment({
      text,
      user: req.session.userID,
    });
    if (!newComment) throw new Error("Comment could not be created");
    await newComment.save();

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      {
        $push: { comments: newComment._id },
      }
    );

    if (!course) throw new Error("Course could not updated");

    res.status(200).json({ message: "Comment created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });

    const commentList = [];
    for (const commentId of course.comments) {
      const comment = await Comment.findById(commentId);
      if (comment) {
        commentList.push(comment);
      }
    }

    if (commentList.length === 0) throw new Error("Comment not found");

    res.status(200).json(commentList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (text === "") throw new Error("Text cannot be empty");
    const commment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      {
        new: true,
      }
    );
    if (!commment) throw new Error("Comment not found or updated");

    res.status(200).json({ message: "Comment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { courseSlug, commentId } = req.params;

    // Kursu bul
    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      {
        $pull: { comments: commentId },
      }
    );
    if (!course) throw new Error("Comment could not deleted");

    // Yorumu bul ve sil
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found or already deleted");

    // Yanıtları sil
    const replies = comment.replies;
    for (const replyId of replies) {
      await Comment.findByIdAndDelete(replyId);
    }

    // Yorumu sil
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    if (text === "") throw new Error("Text cannot be empty");
    const newReply = new Comment({
      text,
      user: req.session.userID,
    });
    if (!newReply) throw new Error("Reply could not be created");
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
    if (!comment) throw new Error("Comment not found or updated");
    res.status(200).json({ message: "Reply created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");

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
    res.status(500).json({ message: error.message });
  }
};

const updateReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { text } = req.body;
    if (text === "") throw new Error("Text cannot be empty");
    const reply = await Comment.findByIdAndUpdate(
      replyId,
      { text },
      { new: true }
    );
    if (!reply) throw new Error("Reply not found or updated");

    res.status(200).json({ message: "Reply updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    // Yanıtı bul ve sil
    const reply = await Comment.findByIdAndDelete(replyId);
    if (!reply) throw new Error("Reply not found or already deleted");

    // Yanıta sahip yorumu bul ve yanıtı çıkar
    const comment = await Comment.findOneAndUpdate(
      { replies: replyId },
      { $pull: { replies: replyId } },
      { new: true } // Güncellenmiş belgeyi döndürmek için { new: true } kullanın
    );

    if (!comment) throw new Error("Comment not found or not updated");

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

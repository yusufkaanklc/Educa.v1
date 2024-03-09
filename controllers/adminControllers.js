import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import userControllers from "./userControllers.js";
import slugify from "slugify";
import errorHandling from "../middlewares/errorHandling.js";

const getUser = async (req, res) => {
  const { userId } = req.params;
  userControllers.accountDetailsFunc(userId, req, res);
};

const updateUser = (req, res) => {
  const { userId } = req.params;
  userControllers.accountUpdateFunc(userId, req, res);
};

const removeUsers = async (req, res) => {
  try {
    const { userList } = req.body;
    if (!userList || userList.length === 0) {
      throw { code: 1, message: "User list cannot be empty" };
    }

    const deletedUserCount = [];

    for (const userId of userList) {
      // Kullanıcıya ait yorumları bulma
      const userComments = await Comment.find({ user: userId });

      // Kullanıcıya ait yorumların yanıtlarını bulma ve silme
      const replyIds = userComments.flatMap((comment) => comment.replies);
      await Comment.deleteMany({ _id: { $in: replyIds } });

      // Kullanıcıya ait yorumları silme
      await Comment.deleteMany({ user: userId });

      for (const userComment of userComments) {
        await Comment.findOneAndUpdate(
          {
            replies: userComment._id,
          },
          { $pull: { replies: userComment?._id } },
          { new: true }
        );

        await Course.findOneAndUpdate(
          { comments: userComment?._id },
          { $pull: { comments: userComment?._id } }
        );
      }

      await Promise.all([
        await Course.updateMany(
          { ownership: userId },
          { ownership: req.session.userID }
        ),

        await Course.updateMany(
          { enrollments: userId },
          { $pull: { enrollments: userId } }
        ),
      ]);

      // Kullanıcıyı silme
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        deletedUserCount.push(userId);
      }
    }

    if (deletedUserCount.length === 0) {
      throw { code: 1, message: "No user deleted" };
    }

    req.session.destroy();

    res
      .status(200)
      .json({ message: `${deletedUserCount.length} users deleted` });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

export default {
  getUser,
  updateUser,
  removeUsers,
};

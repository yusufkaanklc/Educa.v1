import User from "../models/User.js";
import Ownership from "../models/Ownership.js";
import Course from "../models/Course.js";
const authControl = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "teacher") {
      throw new Error("Unauthorized");
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ownershipControl = async (req, res, next) => {
  try {
    const courseSlug = req.params.courseSlug;
    const ownership = await Ownership.findOne({ user: req.session.userID });
    const course = await Course.findOne({ slug: courseSlug });
    if (!ownership.courses.includes(course._id)) {
      throw new Error("Unauthorized or course not found");
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { authControl, ownershipControl };

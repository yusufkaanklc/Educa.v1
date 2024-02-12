import User from "../models/User.js";
import Ownership from "../models/Ownership.js";
import Enrollment from "../models/Enrollment.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcrypt";
import Course from "../models/Course.js";
import CommentCourseRelation from "../models/commentCourseRelations.js";

const register = async (req, res) => {
  try {
    const { username, password, email, avatar, role } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "fields are required" });
    }
    if (role === "admin") {
      return res.status(400).json({ message: "Admin cannot be created" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const newUser = new User({
      username,
      password,
      email,
      avatar,
      role,
    });

    await newUser.save();

    res.status(200).json({ "Created user ": newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    req.session.userID = user._id;
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("Logged out successfully");
    }
  });
};

const accountDetails = async (req, res) => {
  accountDetailsFunc(req.session.userID, req, res);
};

const accountDetailsFunc = async (userId, req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const accountUpdate = (req, res) => {
  accountUpdateFunc(req.session.userID, req, res);
};

const accountUpdateFunc = async (userId, req, res) => {
  try {
    const { username, password, email, avatar, role } = req.body;
    if (!username && !password && !email && !avatar && !role)
      return res.status(400).json("fields are required");
    const userFindAndUpdate = await User.findByIdAndUpdate(userId, {
      username,
      password,
      email,
      avatar,
      role,
    });
    if (!userFindAndUpdate) return res.status(400).json("Account not found");
    res.status(201).json({ "updated user": userFindAndUpdate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userComments = await Comment.find({ user: req.session.userID });

    const replyIds = userComments.flatMap((comment) => comment.replies);

    await Comment.deleteMany({ _id: { $in: replyIds } });

    // Kullanıcının yaptığı tüm yorumları silme
    await Comment.deleteMany({ user: req.session.userID });

    // Kullanıcının yaptığı yorumların ilişkilerini güncelleme
    for (const userComment of userComments) {
      await Comment.findOneAndUpdate(
        {
          replies: userComment._id,
        },
        { $pull: { replies: userComment?._id } },
        { new: true }
      );

      await Comment.findByIdAndUpdate(userComment?._id, {
        $pull: {
          replies: { $in: replyIds },
        },
      });

      const commentCourseRelations = await CommentCourseRelation.findOne({
        comments: userComment._id,
      });

      if (commentCourseRelations) {
        let relationId = commentCourseRelations._id;

        await CommentCourseRelation.updateMany(
          { comments: userComment._id },
          { $pull: { comments: userComment._id } },
          { multi: true }
        );

        const findRelation = await CommentCourseRelation.findById(relationId);

        if (findRelation && findRelation.comments.length === 0) {
          await CommentCourseRelation.findByIdAndDelete(relationId);
        }
      }
    }

    // Kullanıcının enrollments'larını silme
    await Enrollment.deleteMany({ user: req.session.userID });

    // Kullanıcının ownerships'larını silme
    await Ownership.deleteMany({ user: req.session.userID });

    // Kullanıcıyı silme
    const deletedUser = await User.findByIdAndDelete(req.session.userID);
    if (!deletedUser) throw new Error("Failed to delete user");

    // Oturumu sonlandırma
    req.session.destroy();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;

    const findCourse = await Course.findOne({ slug: courseSlug });

    // Kullanıcının kaydını kontrol et
    let enrollment = await Enrollment.findOne({ user: req.session.userID });
    if (!enrollment) {
      // Kayıt yoksa yeni bir kayıt oluştur
      enrollment = new Enrollment({
        user: req.session.userID,
        courses: [findCourse._id],
      });
      await enrollment.save();
    } else {
      // Kullanıcı zaten kayıtlıysa ve kurs zaten kayıtlı değilse kursu kaydet
      if (!enrollment.courses.includes(findCourse._id)) {
        enrollment.courses.push(findCourse._id);
        await enrollment.save();
      } else {
        throw new Error("Course is already enrolled");
      }
    }

    // Başarılı yanıt
    res.status(200).json({ message: "Course enrolled" });
  } catch (error) {
    // Hata durumunda
    res.status(500).json({ message: error.message });
  }
};

const getEnrollments = async (req, res) => {
  try {
    if (!req.session.userID) throw new Error("User not found");

    const enrollments = await Enrollment.find({
      user: req.session.userID,
    }).populate({ path: "courses", select: "title description" });

    if (!enrollments || enrollments.length === 0) {
      throw new Error("Enrollments not found");
    }
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const disenrollCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOne({ slug: courseSlug });
    const enrollments = await Enrollment.findOneAndUpdate({
      user: req.session.userID,
    });
    if (!enrollments) throw new Error("Enrollments not found");
    if (enrollments.courses.includes(course._id)) {
      enrollments.courses = enrollments.courses.filter(
        (course) => course !== course._id
      );
      await enrollments.save();
    }
    if (enrollments.courses.length === 0) {
      await Enrollment.deleteOne({ user: req.session.userID });
    }
    res.status(200).json({ message: "Course disenrolled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnedCourses = async (req, res) => {
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

    const ownership = await Ownership.findOne({
      user: req.session.userID,
    }).populate({
      path: "courses",
      match: filter,
    });

    if (!ownership || !ownership.courses || ownership.courses.length === 0) {
      throw new Error("Owned courses not found");
    }

    const courseInfo = ownership.courses.map((course) => ({
      title: course.title,
      description: course.description,
      id: course._id,
    }));

    res.status(200).json(courseInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  register,
  login,
  logout,
  accountDetails,
  accountDetailsFunc,
  accountUpdate,
  accountUpdateFunc,
  deleteAccount,
  enrollCourse,
  getEnrollments,
  disenrollCourse,
  getOwnedCourses,
};

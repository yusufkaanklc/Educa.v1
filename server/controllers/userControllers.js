import User from "../models/User.js";
import Ownership from "../models/Ownership.js";
import Enrollment from "../models/Enrollment.js";
import Category from "../models/Category.js";
import bcrypt from "bcrypt";
import Course from "../models/Course.js";

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
  try {
    const user = await User.findById(req.session.userID);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const accountUpdate = async (req, res) => {
  try {
    const { username, password, email, avatar } = req.body;
    if (!username || !password || !email)
      return res.status(400).json("fields are required");
    const userFindAndUpdate = await User.findByIdAndUpdate(req.session.userID, {
      username,
      password,
      email,
      avatar,
    });
    if (!userFindAndUpdate) return res.status(400).json("Account not found");
  } catch (error) {}
};

const deleteAccount = async (req, res) => {
  try {
    // Kullanıcıyı bul ve sil
    const user = await User.findByIdAndDelete(req.session.userID);
    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Kullanıcının sahip olduğu kayıtları bul ve sil
    await Ownership.deleteMany({ owner: req.session.userID });

    // Kullanıcının kayıtlı olduğu dersleri bul ve sil
    await Enrollment.deleteMany({ user: req.session.userID });

    // Oturumu sonlandır
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
  accountUpdate,
  deleteAccount,
  enrollCourse,
  getEnrollments,
  disenrollCourse,
  getOwnedCourses,
};

import User from "../models/User.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import bcrypt from "bcrypt";
import Course from "../models/Course.js";
import errorHandling from "../middlewares/errorHandling.js";

const register = async (req, res) => {
  try {
    const { username, password, email, avatar, role, profession } = req.body;
    if (!username || !password || !email) {
      throw { code: 1, message: "All fields are required" };
    }
    if (role === "admin") {
      throw { code: 4, message: "Admin cannot be created" };
    }
    if (role === "teacher" && !profession) {
      throw { code: 4, message: "Profession is required" };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { code: 5, message: "User already exists" };
    }

    const userData = {
      username,
      password,
      email,
      avatar,
      role,
    };

    if (role === "teacher") {
      userData.profession = profession;
    }

    const newUser = new User(userData);

    await newUser.save();

    res.status(200).json({ "Created user ": newUser });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw { code: 1, message: "Email and password are required" };
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw { code: 2, message: "Email not found" };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw { code: 3, message: "incorrect password" };
    }

    req.session.userID = user._id;
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        throw { code: 0, message: "Error logging out" };
      } else {
        res.status(200).send("Logged out successfully");
      }
    });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, username } = req.query;
    // Filtreleme için boş filtre oluşturma
    let filter = {};
    // Eğer role parametresi varsa ve boş değilse filtreye ekle
    if (role && role !== "") {
      filter.role = role;
    }
    // Eğer username parametresi varsa ve boş değilse filtreye eklemek için regex kullan
    if (username && username !== "") {
      const regexPattern = new RegExp(username, "i");
      filter.username = regexPattern;
    }
    // Kullanıcı adı ve rol boş ise tüm kullanıcıları getir
    if (!role && !username) {
      filter = {};
    }

    // Veritabanından kullanıcıları bul
    const users = await User.aggregate([
      {
        $match: filter, // Filter koşullarınızı buraya eklediğinizi varsayalım
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "ownership",
          as: "courses",
        },
      },
      {
        $unwind: {
          path: "$courses",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          username: { $first: "$username" }, // $first operatörüyle diğer alanları koruyoruz
          email: { $first: "$email" },
          avatar: { $first: "$avatar" },
          role: { $first: "$role" },
          profession: { $first: "$profession" },
          point: {
            $avg: {
              $cond: [
                { $eq: ["$courses.point", 0] }, // Kursun puanı 0 ise
                "$$REMOVE", // Ortalamaya dahil etme
                "$courses.point", // Değilse, puanı ortalamaya dahil et
              ],
            },
          },
        },
      },
    ]);

    console.log(users);

    // Kullanıcıları başarıyla bulduğunda 200 OK yanıtı gönder
    res.status(200).json(users);
  } catch (error) {
    // Hata durumunda 500 hatası gönder
    errorHandling(error, req, res);
  }
};

const accountDetails = async (req, res) => {
  accountDetailsFunc(req.session.userID, req, res);
};

const accountDetailsFunc = async (userId, req, res) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw { code: 2, message: "User not found" };
    res.status(200).json({ user });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const accountUpdate = (req, res) => {
  accountUpdateFunc(req.session.userID, req, res);
};

const accountUpdateFunc = async (userId, req, res) => {
  try {
    const { username, password, email, avatar, role, profession } = req.body;
    if (!username && !password && !email && !avatar && !role && !profession)
      throw { code: 1, message: "No field to update" };
    const userFindAndUpdate = await User.findByIdAndUpdate(userId, {
      username,
      password,
      email,
      avatar,
      role,
      profession,
    });
    if (!userFindAndUpdate) throw { code: 2, message: "User not found" };
    res.status(201).json({ "updated user": userFindAndUpdate });
  } catch (error) {
    errorHandling(error, req, res);
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

      await Course.findOneAndUpdate(
        { comments: userComment._id },
        {
          $pull: { comments: userComment?._id },
        }
      );
    }

    const ownership = Course.updateMany(
      { ownership: req.session.userID },
      { $pull: { ownership: null } }
    );
    if (!ownership) throw { code: 2, message: "ownership could not delete" };

    const enrollment = Course.updateMany(
      { enrollments: req.session.userId },
      {
        $pull: { enrollments: req.session.userID },
      }
    );

    if (!enrollment) throw { code: 2, message: "enrollment could not delete" };

    // Kullanıcıyı silme
    const deletedUser = await User.findByIdAndDelete(req.session.userID);
    if (!deletedUser) throw { code: 2, message: "User not found" };

    // Oturumu sonlandırma
    req.session.destroy();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const enrollCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $push: { enrollments: req.session.userID } }
    );

    if (!course) throw { code: 2, message: "Course not found" };

    // Başarılı yanıt
    res.status(200).json({ message: "Course enrolled" });
  } catch (error) {
    // Hata durumunda
    errorHandling(error, req, res);
  }
};

const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Course.find({ enrollments: req.session.userID });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const disenrollCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $pull: { enrollments: req.session.userID } }
    );

    if (!course) throw { code: 2, message: "Course not found" };

    res.status(200).json({ message: "Course disenrolled" });
  } catch (error) {
    errorHandling(error, req, res);
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

    const courses = await Course.find({ ownership: req.session.userID });

    res.status(200).json(courses);
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
  getAllUsers,
};

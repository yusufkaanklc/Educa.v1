import User from "../models/User.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import { unlink } from "fs/promises";
import fs from "fs";
import bcrypt from "bcrypt";
import Course from "../models/Course.js";
import errorHandling from "../middlewares/errorHandling.js";
import CourseStates from "../models/CourseStates.js";
import Lesson from "../models/Lesson.js";

const register = async (req, res) => {
  try {
    const { username, password, email, role, profession, introduce } = req.body;
    if (!username || !password || !email || !role) {
      throw { code: 1, message: "All fields are required" };
    }
    const lowerCaseRole = role.toLowerCase();
    if (lowerCaseRole === "superadmin") {
      throw { code: 4, message: "Admin cannot be created" };
    }
    if (lowerCaseRole === "teacher" && !profession) {
      throw { code: 4, message: "Profession is required" };
    }

    const userData = {
      username,
      password,
      email,
      role: lowerCaseRole,
    };

    if (lowerCaseRole === "teacher") {
      userData.profession = profession;
    }

    if (introduce) {
      userData.introduce = introduce;
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
    res.status(200).json({ message: "Login successful", user: user });
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
          image: { $first: "$image" },
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
    res.status(200).json(user);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const accountUpdate = (req, res) => {
  accountUpdateFunc(req.session.userID, req, res);
};

const accountUpdateFunc = async (userId, req, res) => {
  try {
    const {
      username,
      password,
      email,
      profession,
      introduce,
      currentPassword,
    } = req.body;

    // Gerekli alanların kontrolü
    if (!username && !password && !email && !profession && !currentPassword) {
      throw { code: 1, message: "No field to update" };
    }

    let cryptedPassword;
    let currentPasswordDecrypted;

    // Güncellenecek alanların objesi
    const updatedFields = {
      username,
      email,
      profession,
      introduce,
    };

    const user = await User.findById(userId);

    if (currentPassword && currentPassword !== "") {
      currentPasswordDecrypted = await bcrypt.compare(
        currentPassword,
        user.password
      );
    }

    if (!currentPasswordDecrypted && password && password !== "") {
      throw { code: 2, message: "Invalid current password" };
    }

    // Eğer şifre verilmişse, şifreleme ve karşılaştırma yap
    if (
      password &&
      password !== "" &&
      currentPasswordDecrypted &&
      currentPassword !== password
    ) {
      cryptedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = cryptedPassword;
    }
    if (
      password &&
      password !== "" &&
      currentPasswordDecrypted &&
      currentPassword === password
    ) {
      throw { code: 6, message: " new password must be different" };
    }

    // Eğer yüklenmiş bir resim varsa, resmi güncellenecek alanlara ekle
    if (req.uploadedImageUrl) {
      updatedFields.image = req.uploadedImageUrl;

      // Eski resmi sil
      if (user.image && user.image !== updatedFields.image) {
        if (fs.existsSync(user.image)) {
          await unlink(user.image);
        }
      }
    }

    // Kullanıcıyı güncelle ve yeni veriyi döndür
    const userFindAndUpdate = await User.findByIdAndUpdate(
      userId,
      updatedFields,
      { new: true }
    );

    // Kullanıcı bulunamazsa hata fırlat
    if (!userFindAndUpdate) {
      throw { code: 2, message: "User not found" };
    }

    // Başarılı yanıtı gönder
    res.status(201).json(userFindAndUpdate);
  } catch (error) {
    // Hata yönetimini çağır
    errorHandling(error, req, res);
  }
};

const deleteAccount = async (req, res) => {
  try {
    // Kullanıcının yaptığı tüm yorumları silme
    await Comment.deleteMany({ user: req.session.userID });

    // Kullanıcının yaptığı yorumların ilişkilerini güncelleme
    const userComments = await Comment.find({ user: req.session.userID });
    for (const userComment of userComments) {
      await Course.updateMany(
        { comments: userComment._id },
        { $pull: { comments: userComment._id } }
      );
    }

    // Kullanıcının sahip olduğu kursları kontrol etme ve silme
    const courses = await Course.find({ ownership: req.session.userID });
    for (const course of courses) {
      if (course.enrollments.length > 0) {
        throw {
          code: 2,
          message: `There is a registration for course ${course.title}, it cannot be deleted.`,
        };
      }

      for (const lesson of course.lessons) {
        const deleteLesson = await Lesson.findByIdAndDelete(lesson._id);
        if (!deleteLesson) {
          throw { code: 2, message: "Lesson could not be deleted" };
        }
        if (fs.existsSync(deleteLesson.videoUrl)) {
          await unlink(deleteLesson.videoUrl);
        }

        for (const comment of deleteLesson.comments) {
          await Comment.findByIdAndDelete(comment._id);
        }
      }

      await CourseStates.findOneAndDelete({ course: course._id });
      await Course.findByIdAndDelete(course._id);
      if (fs.existsSync(course.imageUrl)) {
        await unlink(course.imageUrl);
      }
    }

    // Kullanıcının kurs kayıtlarını güncelleme
    await Course.updateMany(
      { enrollments: req.session.userID },
      { $pull: { enrollments: req.session.userID } }
    );

    // kullanıcının course statesini silme
    await CourseStates.deleteMany({ user: req.session.userID });

    // Kullanıcıyı silme
    const deleteAccount = await User.findByIdAndDelete(req.session.userID);
    if (fs.existsSync(deleteAccount.image)) {
      await unlink(deleteAccount.image);
    }

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

    const newCourseStatesData = {
      user: req.session.userID,
      course: course._id,
      lessonsStates: [],
    };

    const isCourseStatesExist = await CourseStates.findOne({
      course: course._id,
      user: req.session.userID,
    });
    if (!isCourseStatesExist) {
      for (const lesson of course.lessons) {
        newCourseStatesData.lessonsStates.push({
          lesson: lesson._id,
        });
      }

      const newCourseStates = await CourseStates.create(newCourseStatesData);

      if (!newCourseStates)
        throw { code: 2, message: "Course state relation could not created" };
    }

    // Başarılı yanıt
    res.status(200).json({ message: "Course enrolled" });
  } catch (error) {
    // Hata durumunda
    errorHandling(error, req, res);
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

    const courseState = await CourseStates.findOneAndDelete({
      course: course._id,
      user: req.session.userID,
    });

    if (!courseState) {
      throw { code: 2, message: "Course state relation could not deleted" };
    }

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
  disenrollCourse,
  getOwnedCourses,
  getAllUsers,
};

import Category from "../models/Category.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Ownership from "../models/Ownership.js";

const createCourse = async (req, res) => {
  try {
    const { title, description, category, imageUrl, price } = req.body;

    // Gelen verilerin boş olup olmadığını kontrol edin
    if (!title || !description || !price) {
      throw new Error("Fields cannot be empty");
    }

    // Yeni bir kurs oluşturun ve kaydedin
    const newCourse = new Course({
      title,
      description,
      category,
      imageUrl,
      price,
    });
    await newCourse.save();

    // Kurs sahipliğini kontrol edin veya oluşturun
    let ownership = await Ownership.findOne({ user: req.session.userID });
    if (!ownership) {
      ownership = new Ownership({ user: req.session.userID, courses: [] });
    }

    // Kursu sahipliğe ekleyin ve kaydedin
    if (!ownership.courses.includes(newCourse._id)) {
      ownership.courses.push(newCourse._id);
      await ownership.save();
    } else {
      throw new Error("Ownership already exists");
    }

    // Başarılı yanıtı döndürün
    res.status(201).json({ message: "Created course", course: newCourse });
  } catch (error) {
    // Hata durumunda uygun bir hata yanıtı döndürün
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
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

    const courses = await Course.find(filter);

    if (!courses || courses.length === 0) {
      throw new Error("Courses not found");
    }

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      throw new Error("Course not found");
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnedCourses = async (req, res) => {
  try {
    const ownership = await Ownership.findOne({
      user: req.session.userID,
    }).populate({ path: "courses", select: "title description" });
    if (!ownership) {
      throw new Error("Ownership not found");
    }
    res.status(200).json(ownership.courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;
    const { title, description, category, imageUrl, price } = req.body;
    if (
      title === "" &&
      description === "" &&
      price === "" &&
      category === "" &&
      imageUrl === ""
    )
      throw new Error("fields cannot be empty");
    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      {
        title,
        description,
        category,
        imageUrl,
        price,
      }
    );
    if (!course) {
      throw new Error("Course could not be updated");
    }
    res.status(200).json({ message: "Course updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseSlug = req.params.courseSlug;

    // Kursu bul ve sil

    const findCourse = await Course.findOne({ slug: courseSlug });

    if (!findCourse) {
      throw new Error("Course not found");
    }

    // Kullanıcıların kursa kaydını kontrol et
    const enrollment = await Enrollment.findOne({
      courses: { $in: [findCourse._id] },
    });

    // Eğer kursa kayıtlı kullanıcı varsa silme işlemini gerçekleştirme
    if (enrollment) {
      throw new Error("Course has enrolled users, cannot be deleted");
    }

    const course = await Course.findOneAndDelete({ slug: courseSlug });

    if (!course) {
      throw new Error("Course could not be deleted");
    }

    // Kullanıcının sahipliğini güncelle
    const updatedOwnership = await Ownership.findOneAndUpdate(
      { user: req.session.userID },
      { $pull: { courses: findCourse._id } },
      { new: true }
    );
    if (!updatedOwnership) {
      throw new Error("Ownership not found or updated");
    }

    // Eğer kullanıcının başka bir kursu yoksa sahipliği sil
    if (updatedOwnership.courses.length === 0) {
      await Ownership.deleteOne({ user: req.session.userID });
    }

    // Başarılı yanıt
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    // Hata durumunda
    res.status(500).json({ message: error.message });
  }
};

export default {
  createCourse,
  getAllCourses,
  getCourse,
  getOwnedCourses,
  updateCourse,
  deleteCourse,
};

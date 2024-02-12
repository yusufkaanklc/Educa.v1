import slugify from "slugify";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

const createLesson = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    const { courseSlug } = req.params;

    if (
      title === "" ||
      description === "" ||
      videoUrl === "" ||
      courseSlug === ""
    ) {
      throw new Error("Fields cannot be empty");
    }

    const newLesson = new Lesson({
      title,
      description,
      videoUrl,
    });

    if (!newLesson) {
      throw new Error("Lesson could not be created");
    }

    await newLesson.save();

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $push: { lessons: newLesson?._id } }
    );

    if (!course) throw new Error("Lessons could not add");

    res.status(200).json({ "created lesson": newLesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const { courseSlug } = req.params;

    // Kursu bulun
    const course = await Course.findOne({ slug: courseSlug });

    // Kurs bulunamazsa 404 hatası dön
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Kursun derslerini bul ve liste oluştur
    const lessonList = await Lesson.find({ _id: { $in: course.lessons } });

    res.status(200).json(lessonList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;

    // Kursu ve dersi bul
    const [course, lesson] = await Promise.all([
      Course.findOne({ slug: courseSlug }),
      Lesson.findOne({ slug: lessonSlug }),
    ]);

    // Kurs veya ders bulunamazsa 404 hatası dön
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Ders kursa ait değilse 404 hatası dön
    if (!course.lessons.includes(lesson._id)) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Hata yoksa dersi döndür
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { title, description, videoUrl } = req.body;

    const [course, lesson] = await Promise.all([
      Course.findOne({ slug: courseSlug }),
      Lesson.findOne({ slug: lessonSlug }),
    ]);

    if (title === "" || description === "" || videoUrl === "")
      throw new Error("All fields required");

    if (!course || !lesson || !course.lessons.includes(lesson?._id))
      throw new Error("Invalid course or lesson");

    const newSlug = slugify(title, { lower: true, strict: true });
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lesson?._id,
      {
        title,
        description,
        videoUrl,
        slug: newSlug,
      },
      { new: true }
    );
    if (!updatedLesson) throw new Error("Lesson update failed");
    res.status(200).json({ "updated lesson": updatedLesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;

    // Kursu ve dersi bul
    const [course, lesson] = await Promise.all([
      Course.findOne({ slug: courseSlug }),
      Lesson.findOne({ slug: lessonSlug }),
    ]);

    // Kurs ve dersin mevcut olup olmadığını ve dersin kursa ait olup olmadığını kontrol et
    if (!course || !lesson || !course.lessons.includes(lesson._id)) {
      throw new Error("Invalid course or lesson");
    }

    // Dersi sil ve kursun dersler listesinden çıkar
    const deletedLesson = await Lesson.findByIdAndDelete(lesson._id);
    await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: lesson._id },
    });

    // Silinen dersi kontrol et
    if (!deletedLesson) {
      throw new Error("Failed to delete lesson");
    }

    // Başarılı yanıtı döndür
    res.status(200).json({ deletedLesson });
  } catch (error) {
    // Hata durumunda uygun bir hata yanıtı döndür
    res.status(500).json({ message: error.message });
  }
};

export default {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
};

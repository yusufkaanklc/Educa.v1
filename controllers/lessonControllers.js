import slugify from "slugify";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import errorHandling from "../middlewares/errorHandling.js";

const createLesson = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { courseSlug } = req.params;

    if (title === "" || description === "" || courseSlug === "") {
      throw { code: 1, message: "All fields required" };
    }

    const newLesson = {
      title,
      description,
    };
    if (req.uploadedVideoUrl) newLesson.videoUrl = req.uploadedVideoUrl;

    const newLessonCreate = new Lesson(newLesson);

    if (!newLessonCreate)
      throw { code: 2, message: "Lesson could not created" };

    await newLessonCreate.save();

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $push: { lessons: newLessonCreate?._id } }
    );

    if (!course) throw { code: 3, message: "Lesson could not add" };

    res.status(200).json({ "created lesson": newLessonCreate });
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getLessons = async (req, res) => {
  try {
    const { courseSlug } = req.params;

    // Kursu bulun
    const course = await Course.findOne({ slug: courseSlug });

    // Kurs bulunamazsa 404 hatası dön
    if (!course) throw { code: 2, message: "Course not found" };

    // Kursun derslerini bul ve liste oluştur
    const lessonList = await Lesson.find({
      _id: { $in: course.lessons },
    }).populate({ path: "comments", select: " text point" });

    res.status(200).json(lessonList);
  } catch (error) {
    errorHandling(error, req, res);
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
    if (!course) throw { code: 2, message: "Course not found" };
    if (!lesson) throw { code: 2, message: "Lesson not found" };

    // Ders kursa ait değilse 404 hatası dön
    if (!course.lessons.includes(lesson._id))
      throw { code: 2, message: "Course could not have this lesson" };

    // Hata yoksa dersi döndür
    res.status(200).json(lesson);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { title, description, isFinished } = req.body;

    const [course, lesson] = await Promise.all([
      Course.findOne({ slug: courseSlug }),
      Lesson.findOne({ slug: lessonSlug }),
    ]);

    if (!title && !description && !isFinished)
      throw { code: 1, message: "All fields required" };

    if (!course || !lesson || !course.lessons.includes(lesson?._id))
      throw { code: 2, message: "Invalid course or lesson" };

    let newSlug;
    let newVideoUrl = lesson.videoUrl;

    if (req.uploadedVideoUrl) newVideoUrl = req.uploadedVideoUrl;

    if (title !== undefined) {
      newSlug = slugify(title, { lower: true, strict: true });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lesson?._id,
      {
        title,
        description,
        newVideoUrl,
        isFinished,

        slug: title !== "" ? newSlug : lessonSlug,
      },
      { new: true }
    );
    if (!updatedLesson) throw { code: 2, message: "Lesson could not updated" };
    res.status(200).json({ "updated lesson": updatedLesson });
  } catch (error) {
    errorHandling(error, req, res);
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
    if (!course || !lesson || !course.lessons.includes(lesson._id))
      throw {
        code: 2,
        message: "Course or lesson not found",
      };

    // Dersi sil ve kursun dersler listesinden çıkar
    const deletedLesson = await Lesson.findByIdAndDelete(lesson._id);
    await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: lesson._id },
    });

    // Kursa ait yorumları al
    const comments = await Comment.find({
      _id: { $in: deletedLesson.comments },
    });

    // Her yorum için
    for (const comment of comments) {
      // Yorumu sil
      await Comment.findByIdAndDelete(comment._id);

      // Yoruma ait cevapları sil
      for (const replyId of comment.replies) {
        await Comment.findByIdAndDelete(replyId);
      }
    }

    // Silinen dersi kontrol et
    if (!deletedLesson) throw { code: 2, message: "Lesson could not deleted" };

    // Başarılı yanıtı döndür
    res.status(200).json({ deletedLesson });
  } catch (error) {
    // Hata durumunda uygun bir hata yanıtı döndür
    errorHandling(error, req, res);
  }
};

export default {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
};

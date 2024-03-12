import slugify from "slugify";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Comment from "../models/Comment.js";
import errorHandling from "../middlewares/errorHandling.js";
import { unlink } from "fs/promises";
import fs from "fs";
import CourseStates from "../models/CourseStates.js";
const createLesson = async (req, res) => {
  try {
    const { title, description, notes, duration } = req.body;
    const { courseSlug } = req.params;

    if (title === "" || description === "" || courseSlug === "") {
      throw { code: 1, message: "All fields required" };
    }

    const newLesson = {
      title,
      description,
    };

    if (req.uploadedVideoUrl) newLesson.videoUrl = req.uploadedVideoUrl;
    if (notes) newLesson.notes = notes;
    if (duration) newLesson.duration = duration;

    const newLessonCreate = new Lesson(newLesson);

    if (!newLessonCreate)
      throw { code: 2, message: "Lesson could not created" };

    await newLessonCreate.save();

    const course = await Course.findOneAndUpdate(
      { slug: courseSlug },
      { $push: { lessons: newLessonCreate?._id } }
    );

    if (!course) throw { code: 3, message: "Lesson could not add" };

    const addCourseState = await CourseStates.updateMany(
      { course: course._id },
      {
        $push: {
          lessonsStates: {
            lesson: newLessonCreate._id,
            state: false,
          },
        },
      }
    );
    if (!addCourseState)
      throw { code: 3, message: "Lesson state relation could not add" };

    const deleteLessonsState = await CourseStates.updateMany(
      { lessonsStates: { $elemMatch: { lesson: newLessonCreate._id } } },
      { courseState: true }
    );

    if (!deleteLessonsState) {
      throw { code: 3, message: "Course state could not updated" };
    }

    res.status(200).json(newLessonCreate);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const getLessons = async (req, res) => {
  try {
    const { courseSlug } = req.params;

    // Kursu bul
    const course = await Course.findOne({ slug: courseSlug });

    // Kurs bulunamazsa 404 hatası dön
    if (!course) throw { code: 404, message: "Course not found" };

    // Kursun derslerini bul, yorum detaylarını dahil et ve ortalama puan hesapla
    const lessons = await Lesson.aggregate([
      {
        $match: {
          _id: { $in: course.lessons },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id", // Yorumların hangi alana göre ilişkilendirildiğini kontrol et
          as: "commentDetails",
        },
      },
      {
        $unwind: {
          path: "$commentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id", // Gruplama için belirleyici bir alan (örneğin, dersin ID'si)
          comments: { $addToSet: "$commentDetails" }, // Benzersiz yorumları bir diziye ekler
          title: { $first: "$title" },
          description: { $first: "$description" },
          videoUrl: { $first: "$videoUrl" },
          duration: { $first: "$duration" },
          notes: { $first: "$notes" },
          slug: { $first: "$slug" },
          createdAt: { $first: "$createdAt" },
          isFinished: { $first: "$isFinished" },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          videoUrl: 1,
          duration: 1,
          notes: 1,
          slug: 1,
          createdAt: 1,
          isFinished: 1,
          comments: 1,
          point: {
            $cond: [
              { $ne: [{ $size: "$comments" }, 0] }, // Burada "$comments" kullanılmalıdır.
              { $avg: "$comments.point" }, // "$comments.point" üzerinden ortalama alınır.
              null,
            ],
          },
        },
      },
      { $sort: { createdAt: +1 } },
    ]);

    res.status(200).json(lessons);
  } catch (error) {
    errorHandling(error, req, res);
  }
};

const updateLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { title, description, notes } = req.body;

    const [course, lesson] = await Promise.all([
      Course.findOne({ slug: courseSlug }),
      Lesson.findOne({ slug: lessonSlug }),
    ]);
    if (!title && !description && !notes && !req.uploadedVideoUrl)
      throw { code: 1, message: "All fields required" };

    if (!course || !lesson || !course.lessons.includes(lesson?._id))
      throw { code: 2, message: "Invalid course or lesson" };

    let newFile = {};

    if (title) {
      newFile.slug = slugify(title, { lower: true, strict: true });
      newFile.title = title;
    }
    if (description) {
      newFile.description = description;
    }
    if (notes) {
      newFile.notes = notes;
    }
    if (
      lesson.videoUrl &&
      req.uploadedVideoUrl &&
      req.uploadedVideoUrl !== lesson.videoUrl
    ) {
      newFile.videoUrl = req.uploadedVideoUrl;
      if (fs.existsSync(lesson.videoUrl)) {
        await unlink(lesson.videoUrl);
      }
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(lesson?._id, newFile, {
      new: true,
    });
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

    if (fs.existsSync(lesson.videoUrl)) {
      await unlink(lesson.videoUrl);
    }

    // Kursa ait yorumları al
    const comments = await Comment.find({
      _id: { $in: deletedLesson.comments },
    });

    // Her yorum için
    if (comments) {
      for (const comment of comments) {
        // Yorumu sil
        await Comment.findByIdAndDelete(comment._id);
      }
    }

    // Silinen dersi kontrol et
    if (!deletedLesson) throw { code: 2, message: "Lesson could not deleted" };

    const deleteLessonsState = await CourseStates.updateMany(
      { lessonsStates: { $elemMatch: { lesson: deletedLesson._id } } },
      { $pull: { lessonsStates: { lesson: deletedLesson._id } } }
    );

    if (!deleteLessonsState) {
      throw { code: 2, message: "Lesson state relations could not deleted" };
    }

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
  updateLesson,
  deleteLesson,
};

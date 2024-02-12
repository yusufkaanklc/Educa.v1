import slugify from "slugify";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import LessonCourseRelation from "../models/lessonCourseRelations.js";

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

    const course = await Course.findOne({ slug: courseSlug });

    if (!course) {
      throw new Error("Course not found");
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

    let existingLessonCourseRelation = await LessonCourseRelation.findOne({
      course: course._id,
    });

    if (!existingLessonCourseRelation) {
      existingLessonCourseRelation = new LessonCourseRelation({
        course: course._id,
        lessons: [newLesson._id],
      });
    } else {
      existingLessonCourseRelation.lessons.push(newLesson._id);
    }

    await existingLessonCourseRelation.save();

    res.status(200).json({ "created lesson": newLesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw new Error("Course not found");

    const lessonRelation = await LessonCourseRelation.findOne({
      course: course._id,
    });
    if (!lessonRelation) throw new Error("Lessons not found");

    const lessonIds = lessonRelation.lessons; // Tüm derslerin kimliklerini al

    // Tüm dersleri tek bir sorgu ile al
    const lessons = await Lesson.find({ _id: { $in: lessonIds } });

    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) throw new Error("Course not found");

    const lesson = await Lesson.findOne({ slug: lessonSlug });
    if (!lesson) throw new Error("Lesson not found");

    const lessonRelation = await LessonCourseRelation.findOne({
      course: course._id,
    });
    if (!lessonRelation) throw new Error("Lesson not found");

    // Dersin kursla ilişkilendirilip ilişkilendirilmediğini kontrol et
    const lessonIds = lessonRelation.lessons.map((lesson) => lesson.toString());
    if (!lessonIds.includes(lesson._id.toString())) {
      throw new Error("This course does not include this lesson");
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    const { title, description, videoUrl } = req.body;

    const course = await Course.findOne({ slug: courseSlug });
    const lesson = await Lesson.findOne({ slug: lessonSlug });
    const lessonRelation = await LessonCourseRelation.findOne({
      course: course?._id,
    });

    if (title === "" || description === "" || videoUrl === "")
      throw new Error("All fields required");

    if (!course || !lesson || !lessonRelation)
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

    const course = await Course.findOne({ slug: courseSlug });
    const lesson = await Lesson.findOne({ slug: lessonSlug });
    const lessonRelation = await LessonCourseRelation.findOne({
      course: course?._id,
    });

    if (
      !course ||
      !lesson ||
      !lessonRelation ||
      !lessonRelation.lessons.includes(lesson._id)
    )
      throw new Error("Invalid course or lesson");

    const deletedLesson = await Lesson.findByIdAndDelete(lesson._id);
    const lessonRelationUpdate = await LessonCourseRelation.findByIdAndUpdate(
      lessonRelation?._id,
      { $pull: { lessons: lesson._id } },
      { new: true } // Güncellenmiş belgeyi döndür
    );

    if (!deletedLesson || !lessonRelationUpdate)
      throw new Error("Failed to delete lesson");

    // Eğer ders ilişkisi boş ise, ilişki belgesini sil
    if (lessonRelationUpdate.lessons.length === 0) {
      const lessonRelationDelete = await LessonCourseRelation.findByIdAndDelete(
        lessonRelationUpdate._id
      );
      if (!lessonRelationDelete)
        throw new Error("Lesson Course relations delete failed");
    }

    res.status(200).json({ deletedLesson: deletedLesson });
  } catch (error) {
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

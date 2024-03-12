import express from "express";
import userControllers from "../controllers/userControllers.js";
import courseControllers from "../controllers/courseControllers.js";
import commentControllers from "../controllers/commentControllers.js";
import lessonControllers from "../controllers/lessonControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import courseMiddlewares from "../middlewares/courseMiddlewares.js";
import fileUploadMiddlewares from "../middlewares/fileUploadMiddlewares.js";

const router = express.Router();

// Kurs eklemek için POST isteği
router
  .route("/add-course")
  .post(
    authMiddlewares.isLoggedIn,
    authMiddlewares.authControl,
    fileUploadMiddlewares(),
    courseControllers.createCourse
  );

// Kursları getirmek için GET isteği
router.route("/").get(courseControllers.getAllCourses);

// Bir kursu getirmek için GET isteği
router.route("/:courseSlug").get(courseControllers.getCourse);

// Bir kursu güncellemek için PUT isteği
router
  .route("/:courseSlug")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
    fileUploadMiddlewares(),
    courseControllers.updateCourse
  );

// Bir kursu silmek için DELETE isteği
router
  .route("/:courseSlug")
  .delete(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
    courseControllers.deleteCourse
  );

// Kursa katılmak için POST isteği
router
  .route("/:courseSlug/enroll")
  .post(authMiddlewares.isLoggedIn, userControllers.enrollCourse);

// Kurstan ayrılmak için POST isteği
router
  .route("/:courseSlug/disenroll")
  .post(authMiddlewares.isLoggedIn, userControllers.disenrollCourse);

// Bir kursa ders eklemek için POST isteği
router
  .route("/:courseSlug/add-lesson")
  .post(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
    fileUploadMiddlewares(),
    lessonControllers.createLesson
  );

// Bir kursun derslerini getirmek için GET isteği
router.route("/:courseSlug/lessons").get(lessonControllers.getLessons);

//Bir dersi güncellemek için PUT isteği
router
  .route("/:courseSlug/lessons/:lessonSlug")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
    fileUploadMiddlewares(),
    lessonControllers.updateLesson
  );

// Bir dersi silme için DELETE isteği
router
  .route("/:courseSlug/lessons/:lessonSlug")
  .delete(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
    lessonControllers.deleteLesson
  );

// Bir kursa yorum yapmak için POST isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/add-comment")
  .post(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    commentControllers.addComment
  );

// Bir kursun yorumunu güncellemek için PUT isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    courseMiddlewares.ownershipControlForComment,
    commentControllers.updateComment
  );

// Bir kursun yorumunu silmek için DELETE isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .delete(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    courseMiddlewares.ownershipControlForComment,
    commentControllers.deleteComment
  );

router
  .route("/:courseSlug/state")
  .get(courseControllers.getCourseOrLessonState);

router
  .route("/:courseSlug/lessons/:lessonSlug/update-state")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    courseControllers.updateCourseOrLessonState
  );
export default router;

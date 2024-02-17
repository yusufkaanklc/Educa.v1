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

// Sahibi olduğu kursları getirmek için GET isteği
router
  .route("/owned-courses")
  .get(authMiddlewares.isLoggedIn, userControllers.getOwnedCourses);

// Kayıtlı olduğu kursları getirmek için GET isteği
router
  .route("/enrolled-courses")
  .get(authMiddlewares.isLoggedIn, userControllers.getEnrollments);

// Bir kursu getirmek için GET isteği
router.route("/:courseSlug").get(courseControllers.getCourse);

// Bir kursu güncellemek için PUT isteği
router
  .route("/:courseSlug")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
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

// Bir dersi getirmek için GET isteği
router
  .route("/:courseSlug/lessons/:lessonSlug")
  .get(lessonControllers.getLesson);

//Bir dersi güncellemek için PUT isteği
router
  .route("/:courseSlug/lessons/:lessonSlug")
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipControl,
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

// Bir kursun yorumlarını getirmek için GET isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/comments")
  .get(commentControllers.getComments);

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

//Bir yoruma cevap vermek için POST isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/comments/:commentId/add-reply")
  .post(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    commentControllers.addReply
  );

// bir yorumun cevaplarını getirmek için GET isteği
router
  .route("/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies")
  .get(commentControllers.getReplies);

// Bir cevabı güncellemek için PUT isteği
router
  .route(
    "/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies/:replyId"
  )
  .put(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    courseMiddlewares.ownershipControlForReply,
    commentControllers.updateReply
  );

// Bir cevabı silmek için DELETE isteği
router
  .route(
    "/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies/:replyId"
  )
  .delete(
    authMiddlewares.isLoggedIn,
    courseMiddlewares.ownershipAndEnrollControl,
    courseMiddlewares.ownershipControlForReply,
    commentControllers.deleteReply
  );

export default router;

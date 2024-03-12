import express from "express";
import adminControllers from "../controllers/adminControllers.js";
import courseControllers from "../controllers/courseControllers.js";
import lessonControllers from "../controllers/lessonControllers.js";
import commentControllers from "../controllers/commentControllers.js";
import userControllers from "../controllers/userControllers.js";
const router = express.Router();

router.route("/users").get(userControllers.getAllUsers);

// Bir kullanıcıyı getirmek için GET isteği
router.route("/users/:userId").get(adminControllers.getUser);

// Bir kullanıcıyı güncelleme
router.route("/users/:userId").put(adminControllers.updateUser);

// kullanıcıyı silme işlemi
router.route("/remove-users").delete(adminControllers.removeUsers);

// Bir kurs oluşturmak için POST isteği
router.route("/add-course").post(courseControllers.createCourse);

// Bir kursu getiren GET isteği
router.route("/courses/:courseSlug").get(courseControllers.getCourse);

//Bir kursu güncellemek için PUT isteği
router.route("/courses/:courseSlug").put(courseControllers.updateCourse);

//Bir kursu silmek için DELETE isteği
router.route("/courses/:courseSlug").delete(courseControllers.deleteCourse);

// Bir kursa yorum yapmak için POST isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/add-comment")
  .post(commentControllers.addComment);

// Bir kursun yorumunu güncellemek için PUT isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .put(commentControllers.updateComment);

// Bir kursun yorumunu silmek için DELETE isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .delete(commentControllers.deleteComment);

// Ders eklemek için POST isteği
router
  .route("/courses/:courseSlug/add-lesson")
  .post(lessonControllers.createLesson);

// Dersleri getirmek için GET isteği
router.route("/courses/:courseSlug/lessons").get(lessonControllers.getLessons);

// Bir dersi güncellemek için PUT isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug")
  .put(lessonControllers.updateLesson);

// Bir dersi silmek için DELETE isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug")
  .delete(lessonControllers.deleteLesson);

export default router;

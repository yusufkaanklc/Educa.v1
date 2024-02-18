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

// Kursları getiren GET isteği
router.route("/courses").get(courseControllers.getAllCourses);

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

// Bir kursun yorumlarını getirmek için GET isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments")
  .get(commentControllers.getComments);

// Bir kursun yorumunu güncellemek için PUT isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .put(commentControllers.updateComment);

// Bir kursun yorumunu silmek için DELETE isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId")
  .delete(commentControllers.deleteComment);

// Bir yorume cevap vermek için POST isteği
router
  .route(
    "//courses/:courseSlug/lessons/:lessonSlug/comments/:commentId/add-reply"
  )
  .post(commentControllers.addReply);

// Cevapları getirmek için GET isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies")
  .get(commentControllers.getReplies);

// Cevabı güncellemek için PUT isteği
router
  .route(
    "/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies/:replyId"
  )
  .put(commentControllers.updateReply);

// Bir cevabı silmek için DELETE isteği
router
  .route(
    "/courses/:courseSlug/lessons/:lessonSlug/comments/:commentId/replies/:replyId"
  )
  .delete(commentControllers.deleteReply);

// Ders eklemek için POST isteği
router
  .route("/courses/:courseSlug/add-lesson")
  .post(lessonControllers.createLesson);

// Dersleri getirmek için GET isteği
router.route("/courses/:courseSlug/lessons").get(lessonControllers.getLessons);

// Bir dersi getirmek için GET isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug")
  .get(lessonControllers.getLesson);

// Bir dersi güncellemek için PUT isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug")
  .put(lessonControllers.updateLesson);

// Bir dersi silmek için DELETE isteği
router
  .route("/courses/:courseSlug/lessons/:lessonSlug")
  .delete(lessonControllers.deleteLesson);

// Bütün kategorileri getiren GET isteği
router.route("/categories").get(adminControllers.getAllCategories);

// Yeni bir kategori oluşturmak için POST isteği
router.route("/add-category").post(adminControllers.createCategory);

// Bir kategoriyi getiren GET isteği
router.route("/categories/:categorySlug").get(adminControllers.getCategory);

// Bir kategoriyi güncellemek için PUT isteği
router.route("/categories/:categorySlug").put(adminControllers.updateCategory);
// Bir kategoriyi silmek için DELETE isteği
router
  .route("/categories/:categorySlug")
  .delete(adminControllers.deleteCategory);

export default router;

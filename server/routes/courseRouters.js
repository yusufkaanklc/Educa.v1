import express from "express";
import userControllers from "../controllers/userControllers.js";
import courseControllers from "../controllers/courseControllers.js";
import userMiddlewares from "../middlewares/userMiddlewares.js";
import courseMiddlewares from "../middlewares/courseMiddlewares.js";

const router = express.Router();

// Kurs eklemek için POST isteği
router
  .route("/")
  .post(
    userMiddlewares.isLoggedIn,
    courseMiddlewares.authControl,
    courseControllers.createCourse
  );

// Kursları getirmek için GET isteği
router.route("/").get(courseControllers.getAllCourses);

// Sahibi olduğu kursları getirmek için GET isteği
router
  .route("/ownership")
  .get(userMiddlewares.isLoggedIn, userControllers.getOwnedCourses);

// Bir kursu getirmek için GET isteği
router.route("/:courseSlug").get(courseControllers.getCourse);

// Bir kursu güncellemek için PUT isteği
router
  .route("/:courseSlug")
  .put(courseMiddlewares.ownershipControl, courseControllers.updateCourse);

// Bir kursu silmek için DELETE isteği
router
  .route("/:courseSlug")
  .delete(courseMiddlewares.ownershipControl, courseControllers.deleteCourse);

// Kayıtlı olduğu kursları getirmek için GET isteği
router
  .route("/enrollments")
  .get(userMiddlewares.isLoggedIn, userControllers.getEnrollments);

// Kursa katılmak için POST isteği
router
  .route("/:courseSlug/enroll")
  .post(userMiddlewares.isLoggedIn, userControllers.enrollCourse);

// Kurstan ayrılmak için POST isteği
router
  .route("/:courseId/disenroll")
  .post(userMiddlewares.isLoggedIn, userControllers.disenrollCourse);

export default router;

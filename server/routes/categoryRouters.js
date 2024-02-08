import express from "express";
import categoryControllers from "../controllers/categoryControllers.js";
import userMiddlewares from "../middlewares/userMiddlewares.js";
const router = express.Router();

// Bütün kategorileri getiren GET isteği
router.route("/").get(categoryControllers.getAllCategories);

// Yeni bir kategori oluşturmak için POST isteği
router
  .route("/")
  .post(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    categoryControllers.createCategory
  );

// Bir kategoriyi getiren GET isteği
router.route("/:categoryId").get(categoryControllers.getCategory);

// Bir kategoriyi güncellemek için PUT isteği
router
  .route("/:categoryId")
  .put(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    categoryControllers.updateCategory
  );

// Bir kategoriyi silmek için DELETE isteği
router
  .route("/:categoryId")
  .delete(
    userMiddlewares.isLoggedIn,
    userMiddlewares.isAdmin,
    categoryControllers.deleteCategory
  );

export default router;

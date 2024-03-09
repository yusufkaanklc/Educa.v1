import express from "express";
import categoryControllers from "../controllers/categoryControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
const router = express.Router();

// Bütün kategorileri getiren GET isteği
router
  .route("/")
  .get(authMiddlewares.authControl, categoryControllers.getAllCategories);

// Yeni bir kategori oluşturmak için POST isteği
router
  .route("/add-category")
  .post(authMiddlewares.authControl, categoryControllers.createCategory);

// Bir kategoriyi güncellemek için PUT isteği
router
  .route("/:categorySlug")
  .put(authMiddlewares.authControl, categoryControllers.updateCategory);
// Bir kategoriyi silmek için DELETE isteği
router
  .route("/:categorySlug")
  .delete(authMiddlewares.authControl, categoryControllers.deleteCategory);

export default router;

import express from "express";
import adminControllers from "../controllers/adminControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
const router = express.Router();

// Bir kullanıcı oluşturma
router
  .route("/users/create-user")
  .post(authMiddlewares.isLoggedIn, adminControllers.createUser);

// Bütün kullanıcıları getiren GET isteği
router
  .route("/users")
  .get(authMiddlewares.isLoggedIn, adminControllers.getAllUsers);

// Bir kullanıcıyı getirmek için GET isteği
router
  .route("/users/:userId")
  .get(authMiddlewares.isLoggedIn, adminControllers.getUser);

// Bir kullanıcıyı güncelleme
router
  .route("/users/:userId")
  .put(authMiddlewares.isLoggedIn, adminControllers.updateUser);
1;

// kullanıcıyı silme işlemi
router
  .route("/users/remove-users")
  .delete(authMiddlewares.isLoggedIn, adminControllers.removeUsers);

// Bütün kategorileri getiren GET isteği
router.route("/categories").get(adminControllers.getAllCategories);

// Yeni bir kategori oluşturmak için POST isteği
router
  .route("/add-category")
  .post(authMiddlewares.isLoggedIn, adminControllers.createCategory);

// Bir kategoriyi getiren GET isteği
router.route("/categories/:categorySlug").get(adminControllers.getCategory);

// Bir kategoriyi güncellemek için PUT isteği
router
  .route("/categories/:categorySlug")
  .put(authMiddlewares.isLoggedIn, adminControllers.updateCategory);
// Bir kategoriyi silmek için DELETE isteği
router
  .route("/categories/:categorySlug")
  .delete(authMiddlewares.isLoggedIn, adminControllers.deleteCategory);

export default router;

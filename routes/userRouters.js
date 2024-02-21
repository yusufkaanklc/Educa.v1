import express from "express";
import userControllers from "../controllers/userControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import validationMiddlewares from "../middlewares/validationMiddlewares.js";
const router = express.Router();

// Kullanıcı kaydı için POST isteği
router
  .route("/register")
  .post(
    authMiddlewares.isLoggedOut,
    validationMiddlewares.validateFormData,
    userControllers.register
  );

// Kullanıcı girisinde POST isteği
router.route("/login").post(authMiddlewares.isLoggedOut, userControllers.login);

// Kullanıcı çıkış işlemi
router.route("/logout").get(authMiddlewares.isLoggedIn, userControllers.logout);

router.route("/accounts").get(userControllers.getAllUsers);

// Kullanıcı bilgileri için GET isteği
router
  .route("/account")
  .get(authMiddlewares.isLoggedIn, userControllers.accountDetails);

// Kullanıcı bilgilerini güncelleme
router
  .route("/account")
  .put(authMiddlewares.isLoggedIn, userControllers.accountUpdate);

// Kullanıcıyı silme
router
  .route("/account")
  .delete(authMiddlewares.isLoggedIn, userControllers.deleteAccount);

export default router;

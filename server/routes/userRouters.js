import express from "express";
import userControllers from "../controllers/userControllers.js";
import userMiddlewares from "../middlewares/userMiddlewares.js";
const router = express.Router();

// Kullanıcı kaydı için POST isteği
router
  .route("/register")
  .post(userMiddlewares.isLoggedOut, userControllers.register);

// Kullanıcı girisinde POST isteği
router.route("/login").post(userMiddlewares.isLoggedOut, userControllers.login);

// Kullanıcı çıkış işlemi
router.route("/logout").get(userMiddlewares.isLoggedIn, userControllers.logout);

// Kullanıcı bilgileri için GET isteği
router
  .route("/account")
  .get(userMiddlewares.isLoggedIn, userControllers.accountDetails);

// Kullanıcı bilgilerini güncelleme
router
  .route("/account")
  .put(userMiddlewares.isLoggedIn, userControllers.accountUpdate);

// Kullanıcıyı silme
router
  .route("/account")
  .delete(userMiddlewares.isLoggedIn, userControllers.deleteAccount);

export default router;

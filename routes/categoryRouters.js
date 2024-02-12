import express from "express";
import categoryControllers from "../controllers/categoryControllers.js";
const router = express.Router();

// Bütün kategorileri getiren GET isteği
router.route("/").get(categoryControllers.getAllCategories);

export default router;

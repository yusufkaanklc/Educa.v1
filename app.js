import express from "express";
import cors from "cors";
import dbConnect from "./db/dbConnect.js";
import userRouters from "./routes/userRouters.js";
import courseRouters from "./routes/courseRouters.js";
import adminRouters from "./routes/adminRouters.js";
import categoryRouters from "./routes/categoryRouters.js";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import authMiddlewares from "./middlewares/authMiddlewares.js";
import fileUpload from "express-fileupload";
import { dirname } from "node:path";
import path from "path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { config } from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// MongoDBStore oluşturuldu
const MongoDBStore = connectMongo(session);

// Database connection
dbConnect(); // MongoDB veritabanına bağlantıyı oluşturan fonksiyon

// Middlewares
app.use(cors()); // Cross-Origin Resource Sharing (CORS) izinleri
app.use(express.json()); // JSON veri analizi middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded veri analizi middleware
app.use(fileUpload());

// Session middleware
const store = new MongoDBStore(
  {
    uri: process.env.DB_URL,
    collection: "sessions",
  },
  (error) => {
    if (error) {
      console.error("Error connecting to MongoDB for sessions:", error);
    }
  }
);

app.use(
  session({
    secret: "TEvc4iZ7rf0oujKEnsYO", // Session verilerini güvence altına almak için gizli anahtar
    resave: false,
    saveUninitialized: true,
    store: store, // MongoDBStore kullanarak session verilerini depolama
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  })
);

// Routes
app.use(
  "/api/admin",
  authMiddlewares.isLoggedIn,
  authMiddlewares.isAdmin,
  adminRouters
);
app.use("/api/users", userRouters);
app.use("/api/courses", courseRouters);
app.use("/api/categories", categoryRouters);
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

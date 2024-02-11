import express from "express";
import cors from "cors";
import dbConnect from "../server/db/dbConnect.js";
import userRouters from "./routes/userRouters.js";
import courseRouters from "./routes/courseRouters.js";
import adminRouters from "./routes/adminRouters.js";
import categoryRouters from "./routes/categoryRouters.js";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import helmet from "helmet";
import authMiddlewares from "./middlewares/authMiddlewares.js";

const app = express();

// MongoDBStore oluşturuldu
const MongoDBStore = connectMongo(session);

// Database connection
dbConnect(); // MongoDB veritabanına bağlantıyı oluşturan fonksiyon

// Middlewares
app.use(helmet());
app.use(cors()); // Cross-Origin Resource Sharing (CORS) izinleri
app.use(express.json()); // JSON veri analizi middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded veri analizi middleware

// Session middleware
const store = new MongoDBStore(
  {
    uri: "mongodb://127.0.0.1:27017/education-app-db",
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
  "/admin",
  authMiddlewares.isLoggedIn,
  authMiddlewares.isAdmin,
  adminRouters
);
app.use("/users", userRouters);
app.use("/courses", courseRouters);
app.use("/categories", categoryRouters);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

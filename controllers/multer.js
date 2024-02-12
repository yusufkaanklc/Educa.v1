import fs from "fs";
import path from "path";
import multer from "multer";

// multer ile resmi yükle
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = "public/uploads";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage }).single("image");

export default upload;

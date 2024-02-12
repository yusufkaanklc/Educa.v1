import fs from "fs";
import path from "path"; // path modülünü içe aktarın
import multer from "multer";

const multerFunc = (uploadPath) => {
  return (req, res, next) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const directory = `public/uploads/${uploadPath}`;
        if (!fs.existsSync(directory)) {
          // Dizin zaten varsa oluşturmasın
          fs.mkdirSync(directory, { recursive: true }); // Dizini oluşturur
        }
        cb(null, directory);
      },
      filename: (req, file, cb) => {
        const filePath = path.join(
          `public/uploads/${uploadPath}`,
          file.fieldname +
            "-" +
            Date.now() +
            "-" +
            path.extname(file.originalname)
        );
        if (fs.existsSync(filePath)) {
          // Mevcut bir dosya varsa, bir hata oluştur ve bir sonraki işleme geç
          const error = new Error("Aynı isimde dosya zaten var");
          error.status = 409;
          return next(error);
        }
        cb(
          null,
          file.fieldname +
            "-" +
            Date.now() +
            "-" +
            path.extname(file.originalname)
        );
      },
    });

    const upload = multer({ storage: storage }).single("image");
    upload(req, res, next); // Multer yükleyici işlevini çağır
  };
};

export default multerFunc;

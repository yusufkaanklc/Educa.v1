import { access, constants, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);

const fileUpload = (filePath) => {
  return async (req, res, next) => {
    try {
      if (req.files && req.files.image) {
        const uploadedImage = req.files.image;
        const uploadDir = join("public", "uploads", filePath);
        const uploadPath = join(uploadDir, uploadedImage.name);

        // Dosya yolu kontrol ediliyor, eğer yoksa oluşturuluyor
        try {
          await access(uploadDir, constants.F_OK);
        } catch (err) {
          // Dosya yolu zaten varsa ve oluşturulamazsa, bir hata döndür
          if (err.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
          } else {
            throw new Error("Direction could not create", err);
          }
        }

        console.log("uploadPath", uploadPath);
        // Dosyayı taşı
        await uploadedImage.mv(uploadPath);

        // Middleware'den sonraki fonksiyona dosya yolu bilgisini ekleyin
        req.uploadedImageUrl = uploadPath;

        // Sonraki middleware veya route handler'ını çağırın
        next();
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export default fileUpload;

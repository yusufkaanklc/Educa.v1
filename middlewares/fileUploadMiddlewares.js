import { access, constants, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";

const uploadFile = async (file, fileType) => {
  const uploadDir = join("public", "uploads");
  const ext = extname(file.name);
  const uploadPath = join(uploadDir, `${fileType}_${Date.now()}${ext}`);

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
  await file.mv(uploadPath);

  return uploadPath;
};

const fileUpload = () => {
  return async (req, res, next) => {
    try {
      if (req.files && (req.files.image || req.files.video)) {
        let uploadedFile;
        let fileType;

        if (req.files.image) {
          uploadedFile = req.files.image;
          fileType = "image";
        } else {
          uploadedFile = req.files.video;
          fileType = "video";
        }

        const uploadPath = await uploadFile(uploadedFile, fileType);

        // Middleware'den sonraki fonksiyona dosya yolu bilgisini ekleyin
        req[fileType === "image" ? "uploadedImageUrl" : "uploadedVideoUrl"] =
          uploadPath;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

export default fileUpload;

import { access, constants, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import errorHandling from "./errorHandling.js";

const uploadFile = async (file, fileType) => {
  const uploadDir = join("public", "uploads");
  const fileName = file.name;
  const cleanedFileName = fileName.replace(/[^a-zA-Z0-9-_.]/g, "");
  let uploadPath;
  if (fileType === "image") {
    uploadPath = join(
      uploadDir, // burada yüklenecdk konumun bilgisayardaki konumunu aldık public/uploads
      `${fileType}_${cleanedFileName.split(".").slice(0, -1).join(".")}.webp` // image_denemeresmi.webp
      // public/uploads/image_denemeresmi.webp
    );
  } else {
    uploadPath = join(uploadDir, `${fileType}_${cleanedFileName}`);
  }

  // Dosya yolu kontrol ediliyor, eğer yoksa oluşturuluyor
  try {
    await access(uploadPath, constants.F_OK); // Burada uploadPath kontrol ediliyor
  } catch (err) {
    // Dosya yoksa veya erişilemezse, oluşturuluyor
    if (err.code === "ENOENT") {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        throw { code: 2, message: "Directory could not be created" };
      }
    } else {
      throw { code: 4, message: "File already exists or cannot be accessed" };
    }
  }

  fileType === "image"
    ? await sharp(file.data).webp().toFile(uploadPath)
    : file.mv(uploadPath);

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
      errorHandling(error, req, res);
    }
  };
};

export default fileUpload;

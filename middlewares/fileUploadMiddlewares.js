import { access, constants, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const uploadFile = async (file, fileType) => {
  const uploadDir = join("public", "uploads");
  const fileName = file.name;
  const cleanedFileName = fileName.replace(/[#]/g, ""); // Remove all '#' characters
  let uploadPath;
  if (fileType === "image") {
    uploadPath = join(
      uploadDir,
      `${fileType}_${cleanedFileName.split(".").slice(0, -1).join(".")}.webp`
    );
  } else {
    uploadPath = join(uploadDir, `${fileType}_${fileName}`);
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
        throw new Error("Directory could not be created", err);
      }
    } else {
      throw new Error("File already exists or cannot be accessed", err);
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
      res.status(500).json({ message: error.message });
    }
  };
};

export default fileUpload;

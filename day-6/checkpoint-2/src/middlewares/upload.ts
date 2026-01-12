import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = [".png", ".jpg", ".jpeg", ".gif"];
    if (!allowed.includes(ext)) {
      return cb(
        new Error("Tipe file tidak diizinkan (hanya .png, .jpg, .jpeg, .gif)")
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
});

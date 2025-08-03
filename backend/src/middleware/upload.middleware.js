import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    if (!isImage) return cb(new Error("Only image files are allowed"), false);
    cb(null, true);
  },
});

export default upload;

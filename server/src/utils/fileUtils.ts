import multer from "multer";

//Storage for images
export const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pictures");
  },
  filename: function (req, file, cb) {
    const time = Date.now();
    const fileName = `${time}-${file.originalname}`;
    cb(null, fileName);
  },
});

//Storage for files
export const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/files");
  },
  filename: function (req, file, cb) {
    const time = Date.now();
    const fileName = `${time}-${file.originalname}`;
    cb(null, fileName);
  },
});

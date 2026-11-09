import multer from "multer";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const uploadPhoto = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 3,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Formato de imagem não permitido."));
    }

    cb(null, true);
  },
});

export default uploadPhoto;

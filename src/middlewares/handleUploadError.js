import multer from "multer";

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "A imagem deve ter no máximo 5 MB.",
      });
    }

    return res.status(400).json({
      message: "Erro no envio da imagem.",
    });
  }

  if (error.message === "Formato de imagem não permitido.") {
    return res.status(400).json({
      message: error.message,
    });
  }

  return next(error);
};

export default handleUploadError;

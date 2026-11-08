const handleError = (err, req, res, next) => {
  console.error("Erro na API:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: "Erro interno do servidor.",
  });
};

export default handleError;

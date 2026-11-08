import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../models/User.js";

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado.",
    });
  }

  const [scheme, token, extra] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token || extra) {
    return res.status(401).json({
      message: "Formato de token inválido.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }

  if (
    typeof decoded !== "object" ||
    !mongoose.isValidObjectId(decoded.sub) ||
    !Number.isInteger(decoded.tokenVersion)
  ) {
    return res.status(401).json({
      message: "Token inválido.",
    });
  }

  try {
    const user = await User.findById(decoded.sub).select("tokenVersion");

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
      });
    }

    if ((user.tokenVersion ?? 0) !== decoded.tokenVersion) {
      return res.status(401).json({
        message: "Sessão expirada. Faça login novamente.",
      });
    }

    req.userId = user._id.toString();

    return next();
  } catch (error) {
    return next(error);
  }
};

export default authenticateToken;

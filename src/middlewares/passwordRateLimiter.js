
import { rateLimit } from "express-rate-limit";

export const lostPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 3,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Muitas solicitações de recuperação. Tente novamente em 15 minutos.",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message:
      "Muitas tentativas de redefinição. Tente novamente em 15 minutos.",
  },
});

import { rateLimit, ipKeyGenerator } from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  keyGenerator: (req) => {
    const username =
      typeof req.body?.username === "string"
        ? req.body.username.trim().toLowerCase()
        : "unknown";

    return `${ipKeyGenerator(req.ip)}:${username}`;
  },

  message: {
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
});

export const generalAuthRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 100,

  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    message: "Muitas requisições de login. Tente novamente em 15 minutos.",
  },
});

export default authRateLimiter;

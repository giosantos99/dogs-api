import { Router } from "express";

import AuthController from "../controllers/AuthController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

import authRateLimiter, {
  generalAuthRateLimiter,
} from "../middlewares/authRateLimiter.js";

const router = Router();

router.post(
  "/token",
  generalAuthRateLimiter,
  authRateLimiter,
  AuthController.login,
);

router.post("/token/validate", authenticateToken, AuthController.validateToken);

export default router;

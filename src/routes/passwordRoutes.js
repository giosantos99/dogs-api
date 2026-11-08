import { Router } from "express";

import PasswordController from "../controllers/PasswordController.js";

import {
  lostPasswordLimiter,
  resetPasswordLimiter,
} from "../middlewares/passwordRateLimiter.js";

const router = Router();

router.post("/lost", lostPasswordLimiter, PasswordController.lost);

router.post("/reset", resetPasswordLimiter, PasswordController.reset);

export default router;

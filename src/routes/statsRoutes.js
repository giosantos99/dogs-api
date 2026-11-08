import { Router } from "express";

import StatsController from "../controllers/StatsController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = Router();

router.get("/", authenticateToken, StatsController.index);

export default router;

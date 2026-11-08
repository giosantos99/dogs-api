import { Router } from "express";

import UserController from "../controllers/UserController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = Router();

router.post("/", UserController.store);

router.get("/", authenticateToken, UserController.show);

export default router;
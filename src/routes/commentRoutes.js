import { Router } from "express";

import CommentController from "../controllers/CommentController.js";
import authenticateToken from "../middlewares/authenticateToken.js";

const router = Router();

router.post("/:id", authenticateToken, CommentController.store);

export default router;

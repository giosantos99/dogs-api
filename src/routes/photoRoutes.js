import { Router } from "express";

import PhotoController from "../controllers/PhotoController.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import uploadPhoto from "../middlewares/uploadPhoto.js";

const router = Router();

router.get("/", PhotoController.index);
router.get("/:id", PhotoController.show);

router.post(
  "/",
  authenticateToken,
  uploadPhoto.single("img"),
  PhotoController.store,
);

router.delete("/:id", authenticateToken, PhotoController.destroy);

export default router;

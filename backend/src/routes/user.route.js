import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  updateProfile,
  uploadProfileImage,
} from "../controllers/user.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.put("/profile", authenticate, updateProfile);
router.post(
  "/upload",
  authenticate,
  upload.single("image"),
  uploadProfileImage
);


export default router;

import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getUsers,
  toggleUserRole,
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
router.get("/", authenticate, getUsers);
router.patch("/:id", authenticate, toggleUserRole);

export default router;

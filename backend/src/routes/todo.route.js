import express from "express";
import { createTodo, getTodos } from "../controllers/todo.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-todo", authenticate, createTodo);
router.get("/", authenticate, getTodos);

export default router;

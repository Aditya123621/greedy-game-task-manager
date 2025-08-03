import express from "express";
import { createTodo } from "../controllers/todo.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-todo", authenticate, createTodo);

export default router;

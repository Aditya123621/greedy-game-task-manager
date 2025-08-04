import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodoById,
} from "../controllers/todo.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-todo", authenticate, createTodo);
router.get("/", authenticate, getTodos);
router.get("/:id", authenticate, getTodoById);
router.patch("/:id", authenticate, updateTodoById);
router.delete("/:id", authenticate, deleteTodo); 

export default router;

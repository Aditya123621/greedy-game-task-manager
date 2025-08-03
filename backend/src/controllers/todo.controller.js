import { Todo } from "../models/todo.model.js";
import dayjs from "dayjs";

export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, dueTime } = req.body;

    if (!title || !description || !dueDate || !dueTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const parsedDate = dayjs(dueDate, "YYYY-MM-DD", true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: "Invalid due date format." });
    }

    const newTodo = new Todo({
      title: title.trim(),
      description: description.trim(),
      dueDate: parsedDate.toDate(),
      dueTime,
    });

    await newTodo.save();

    res
      .status(201)
      .json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

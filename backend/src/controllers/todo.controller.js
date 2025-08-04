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

export const getTodos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sortBy = "dueDate",
      sortOrder = "asc",
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [todos, total] = await Promise.all([
      Todo.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Todo.countDocuments(filter),
    ]);

    const hasMore = skip + todos.length < total;

    const pendingCount = await Todo.countDocuments({ status: "Upcoming" });
    const completedCount = await Todo.countDocuments({ status: "Completed" });
    const totalCount = pendingCount + completedCount;

    res.json({
      todos,
      hasMore,
      stats: {
        total: totalCount,
        upcoming: pendingCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).json({ message: "Failed to fetch todo", error });
  }
};

export const updateTodoById = async (req, res) => {
  try {
    const { title, description, dueDate, dueTime, status } = req.body;
    const { id } = req.params;

    if (!title || !description || !dueDate || !dueTime || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    todo.title = title.trim();
    todo.description = description.trim();
    todo.dueDate = dayjs(dueDate, "YYYY-MM-DD", true).toDate();
    todo.dueTime = dueTime;
    todo.status = status;

    await todo.save();

    res.status(200).json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

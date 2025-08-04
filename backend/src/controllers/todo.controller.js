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

    const pendingCount = await Todo.countDocuments({ status: "Pending" });
    const completedCount = await Todo.countDocuments({ status: "Completed" });
    const totalCount = pendingCount + completedCount;

    res.json({
      todos,
      hasMore,
      stats: {
        total: totalCount,
        pending: pendingCount,
        completed: completedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ message: "Server error" });
  }
};

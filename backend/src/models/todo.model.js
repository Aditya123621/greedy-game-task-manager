import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 700,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    dueTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);

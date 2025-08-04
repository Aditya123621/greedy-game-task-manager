export interface TodoItem {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: "Pending" | "Completed";
  createdAt: string;
  updatedAt: string;
}
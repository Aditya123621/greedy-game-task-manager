export interface TodoItem {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: "Upcoming" | "Completed";
  createdAt: string;
  updatedAt: string;
}
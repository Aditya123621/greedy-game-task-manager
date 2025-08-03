import api from "@/lib/api";
import apiEndPoints from "@/services/apiEndpoint";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { AppDispatch } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface TodoPayload {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async (data: TodoPayload) => {
      const res = await api.post(apiEndPoints.ADD_TODO, data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch(closeDrawer());
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

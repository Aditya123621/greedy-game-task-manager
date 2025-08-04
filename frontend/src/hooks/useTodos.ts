import api from "@/lib/api";
import apiEndPoints from "@/services/apiEndpoint";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { AppDispatch } from "@/store/store";
import { TodoItem } from "@/types/todo";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface TodoPayload {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
}

interface TodoFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface TodoPageResponse {
  todos: TodoItem[];
  hasMore: boolean;
  stats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async (data: TodoPayload) => {
      const res = await api.post(apiEndPoints.ADD_TODO, data);
      return res.data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      dispatch(closeDrawer());
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error: AxiosError) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
}

export const useGetListQuery = ({
  search,
  status,
  sortBy,
  sortOrder,
}: TodoFilters) => {
  return useInfiniteQuery<TodoPageResponse, Error>({
    queryKey: ["todos", search, status, sortBy, sortOrder],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const res = await api.get("/api/todos", {
        params: {
          page: pageParam,
          limit: 10,
          search,
          status,
          sortBy,
          sortOrder,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasMore ? (lastPageParam as number) + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

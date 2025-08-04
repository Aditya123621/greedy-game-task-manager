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
  useQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface TodoPayload {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status?: string;
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
    upcoming: number;
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
      queryClient.invalidateQueries({ queryKey: ["upcomingTodos"] });
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
  const dispatch = useDispatch<AppDispatch>();
  return useInfiniteQuery<TodoPageResponse, Error>({
    queryKey: ["todos", search, status, sortBy, sortOrder],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const res = await api.get(apiEndPoints.GET_ALL_TODO, {
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

export const useGetTodoById = (id: string | null) => {
  return useQuery<TodoItem, Error>({
    queryKey: ["todo", id],
    queryFn: async () => {
      const res = await api.get(apiEndPoints.GET_TODO_BY_ID(id!));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async ({ id, ...data }: TodoPayload & { id: string }) => {
      const res = await api.patch(apiEndPoints.GET_TODO_BY_ID(id!), data);
      return res.data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      dispatch(closeDrawer());
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingTodos"] });
    },
    onError: (error: AxiosError) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(apiEndPoints.GET_TODO_BY_ID(id!));
      return res.data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      dispatch(closeDrawer());
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingTodos"] });
    },
    onError: (error: AxiosError) => {
      toast.error(error?.message || "Failed to delete todo");
    },
  });
};

export const useUpcomingTodos = (shouldFetch: boolean) => {
  return useQuery<TodoItem[]>({
    queryKey: ["upcomingTodos"],
    queryFn: async () => {
      const res = await api.get(apiEndPoints.GET_UPCOMING_TODO);
      return res.data.todos;
    },
    refetchInterval: 3 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
    enabled: shouldFetch,
  });
};

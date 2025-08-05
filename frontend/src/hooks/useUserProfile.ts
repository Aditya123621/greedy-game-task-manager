import api from "@/lib/api";
import apiEndPoints from "@/services/apiEndpoint";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface ProfileFormData {
  name: string;
}

interface MeResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface UserFilters {
  search: string;
  role: string;
  sortBy: string;
  sortOrder: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

interface AdminUsersResponse {
  users: AdminUser[];
  hasMore: boolean;
  total: number;
}

export const useGetUserInfo = () => {
  const { data: session, status, update } = useSession();

  return useQuery<User, Error>({
    queryKey: ["user-info"],
    queryFn: async () => {
      const res = await api.get<MeResponse>(apiEndPoints.GET_USER_INFO);
      const userFromAPI = res.data.user;

      if (
        session?.user &&
        (userFromAPI.name !== session.user.name ||
          userFromAPI.role !== session.user.role)
      ) {
        await update();
      }

      return userFromAPI;
    },
    enabled: status === "authenticated" && !!session?.backendToken,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put(apiEndPoints.UPDATE_PROFILE, data);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    onError: (error: AxiosError) => {
      console.error("Profile update failed:", error.message);
    },
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(
        apiEndPoints.UPLOAD_PROFILE_IMAGE,
        formData
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    onError: (error: AxiosError) => {
      console.error("Profile update failed:", error.message);
    },
  });
};

export const useGetUsersQuery = ({
  search,
  role,
  sortBy,
  sortOrder,
}: UserFilters) => {
  return useInfiniteQuery<AdminUsersResponse, Error>({
    queryKey: ["all_users", search, role, sortBy, sortOrder],
    queryFn: async ({ pageParam = 1 }: QueryFunctionContext) => {
      const res = await api.get(apiEndPoints.GET_ALL_USERS, {
        params: {
          page: pageParam,
          limit: 10,
          search,
          role,
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

export const useToggleUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(apiEndPoints.UPDATE_USER_ROLE(id));
      return res.data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "Role updated");
      queryClient.invalidateQueries({ queryKey: ["all_users"] });
    },
    onError: (error: AxiosError) => {
      toast.error(error?.message || "Failed to update role");
    },
  });
};

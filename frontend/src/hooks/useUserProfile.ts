import api from "@/lib/api";
import apiEndPoints from "@/services/apiEndpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

interface ProfileFormData {
  name: string;
}

interface MeResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const useGetUserInfo = () => {
  const { data: session, status } = useSession();

  return useQuery<User, Error>({
    queryKey: ["user-info"],
    queryFn: async () => {
      const res = await api.get<MeResponse>(apiEndPoints.GET_USER_INFO);
      return res.data.user;
    },
    enabled: status === "authenticated" && !!session?.backendToken,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.put(apiEndPoints.UPDATE_PROFILE, data.name);
      return response.data;
    },
    onSuccess: async () => {
      console.log("Profile updated successfully.");
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

import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { setUser } from "@/store/slices/authSlice";
import api from "@/lib/api";
import { User } from "@/store/slices/authSlice";

interface MeResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const useLoadUser = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  return useQuery<MeResponse, Error>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const res = await api.get<MeResponse>("/auth/me", {
          headers: {
            Authorization: `Bearer ${session?.backendToken}`,
          },
        });

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }

        return res.data;
      } catch (error) {
        console.error("Failed to fetch /me:", error);
        throw error;
      }
    },
    enabled: status === "authenticated" && !!session?.backendToken,
    staleTime: 5 * 60 * 1000,
  });
};

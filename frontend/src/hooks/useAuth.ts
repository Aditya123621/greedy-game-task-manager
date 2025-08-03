import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "@/lib/api";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { User } from "@/store/slices/authSlice";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: async (data, variables) => {
      const result = await signIn("credentials", {
        email: variables.email,
        password: variables.password,
        redirect: false,
      });

      if (!result?.error) {
        dispatch(setUser(data.user));
        router.push("/");
      } else {
        console.error("Auto sign-in failed:", result.error);
      }
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      dispatch(clearUser());
    },
  });

  return {
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
  };
};

import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import apiEndPoints from "@/services/apiEndpoint";
import type { Session } from "next-auth";
import { joinUrl } from "@/utils/joinUrl";

export interface ApiResponse<T = Record<string, unknown>> {
  status: "SUCCESS" | "ERROR";
  data?: T;
  message?: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASEURL ?? "",
  withCredentials: true,
});

console.log("Axios Base URL:", api.defaults.baseURL);

let isLoggingOut = false;

const createSessionMemoizer = (ttl = 600_000) => {
  let session: Session | null = null;
  let expiry = 0;

  return async (): Promise<Session | null> => {
    const now = Date.now();
    if (session && now < expiry) {
      return session;
    }

    session = await getSession();
    expiry = now + ttl;
    return session;
  };
};

const memoizedGetSession = createSessionMemoizer();

api.interceptors.request.use(async (config: CustomAxiosRequestConfig) => {
  const session = await memoizedGetSession();
  const token = session?.backendToken ?? "";

  if (token) {
    config.headers = config.headers || ({} as AxiosRequestHeaders);
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }

  document.body.style.cursor = "wait";
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    document.body.style.cursor = "default";
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    document.body.style.cursor = "default";

    const session = await memoizedGetSession();
    const token = session?.backendToken ?? "";
    const status = error.response?.status;

    if (status === 403) {
      redirect("/");
    }

    if ([401, 405].includes(status ?? 0) && !isLoggingOut) {
      try {
        isLoggingOut = true;
        const logoutUrl = joinUrl(
          process.env.NEXT_PUBLIC_BACKEND_BASEURL!,
          apiEndPoints.LOG_OUT
        );
        const config: AxiosRequestConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await api.post<ApiResponse>(logoutUrl, {}, config);
        if (res.data.status === "SUCCESS") {
          localStorage.clear();
        }
      } catch (err) {
        const axiosError = err as AxiosError<ApiResponse>;
        console.error(
          axiosError.response?.data?.message ?? "Something went wrong"
        );
      }

      localStorage.clear();

      await signOut({
        redirect: true,
        callbackUrl: apiEndPoints.SIGN_IN,
      });

      isLoggingOut = false;
    }

    return Promise.reject(error);
  }
);

export default api;

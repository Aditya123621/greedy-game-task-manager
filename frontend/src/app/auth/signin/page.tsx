"use client";

import { useForm, Controller } from "react-hook-form";
import { TextInput, PasswordInput, Button, Checkbox } from "@mantine/core";
import GoogleIcon from "@@/icons/google-icon.svg";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CompanyLogo from "@@/images/greedy-game-logo.svg";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: SignInFormData) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe?.toString(),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch {
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <CompanyLogo className="w-1/3 h-full text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-[#21252B] mb-2 ">
          Welcome to GGTodo
        </h2>
        <p className="text-gray-600">To get started, please sign in</p>
      </div>

      <div className="space-y-6">
        <Button
          size="lg"
          radius={"md"}
          leftSection={<GoogleIcon height={20} width={20} />}
          onClick={handleGoogleSignIn}
          fullWidth
          classNames={{
            root: "!border-gray-300 !bg-white !text-gray-700 hover:!bg-gray-50",
          }}
        >
          Log in with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-custom-red-1 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  placeholder="Enter your registered email"
                  label={"Email Address"}
                  withAsterisk
                  error={errors.email?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  placeholder="Enter your password"
                  label={"Password"}
                  withAsterisk
                  error={errors.password?.message}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Checkbox
                  {...field}
                  checked={value}
                  onChange={onChange}
                  label="Remember me"
                  size="sm"
                  className="text-sm text-gray-700"
                />
              )}
            />

            <h4 className="text-[#657081] font-medium cursor-not-allowed">
              Forgot Password?
            </h4>
          </div>

          <Button type="submit" size="lg" loading={isLoading} fullWidth>
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

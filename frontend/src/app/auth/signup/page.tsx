"use client";

import { useForm, Controller } from "react-hook-form";
import { TextInput, PasswordInput, Button, Checkbox } from "@mantine/core";
import GoogleIcon from "@@/icons/google-icon.svg";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import CompanyLogo from "@@/images/greedy-game-logo.svg";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });
  const { register, isRegistering } = useAuth();

  const handleSignUp = (data: SignUpFormData) => {
    try {
      register({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      console.error(errorMessage);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <CompanyLogo className="w-1/3 h-full text-black" />
        </div>
        <h2 className="text-3xl font-semibold text-custom-primary-black my-4 text-center">
          You&apos;re one click away from less busywork
        </h2>
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
          Sign Up with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Name must be at most 50 characters",
              },
              validate: (value) => {
                if (value.trim().length === 0)
                  return "Full name cannot be empty";
                return true;
              },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="John Doe"
                withAsterisk
                label="Full name"
              />
            )}
          />

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
                placeholder="Example@site.com"
                withAsterisk
                label="Email Address"
              />
            )}
          />

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
                placeholder="Minimum 8 characters"
                label="Password"
                withAsterisk
              />
            )}
          />

          <Controller
            name="agreeToTerms"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value, ...field } }) => (
              <Checkbox
                {...field}
                checked={value}
                onChange={onChange}
                size="sm"
                label="Agree to Terms of Service and Privacy Policy"
                error={errors.agreeToTerms?.message}
                classNames={{
                  input: `${errors.agreeToTerms ? "!border-red-500" : ""} `,
                  label: "!cursor-pointer",
                }}
              />
            )}
          />

          <Button
            type="submit"
            size="lg"
            loading={isRegistering}
            fullWidth
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isRegistering ? "Creating account..." : "Get Started"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";
import apiEndPoints from "@/services/apiEndpoint";
import { joinUrl } from "@/utils/joinUrl";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        console.log(
          joinUrl(process.env.NEXT_PUBLIC_BACKEND_BASEURL!, apiEndPoints.SIGN_IN),
          "jointntntntntn"
        );
        try {
          const response = await axios.post(
            joinUrl(process.env.NEXT_PUBLIC_BACKEND_BASEURL!, apiEndPoints.SIGN_IN),
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { success, user, token } = response.data;

          if (success && user) {
            return {
              id: user._id,
              email: user.email,
              name: user.name,
              image: user.avatar,
              token: token,
              rememberMe: credentials.rememberMe === "true",
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_BASEURL}/auth/google/callback`,
            {
              googleId: user.id,
              email: user.email,
              name: user.name,
              avatar: user.image,
            }
          );

          if (response.data.success) {
            token.backendToken = response.data.token;
            token.id = response.data.user._id;
            token.user = response.data.user;
            token.rememberMe = true;
          }
        } catch (error) {
          console.error("Google auth callback error:", error);
        }
      }

      if (user?.token) {
        token.backendToken = user.token;
        token.id = user.id;
        token.rememberMe = user.rememberMe;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }

      if (token.rememberMe) {
        token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      } else {
        token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      }

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;

      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.user?.role || "user",
        createdAt:
          token.user?.createdAt || token.createdAt || new Date().toISOString(),
        updatedAt:
          token.user?.updatedAt || token.updatedAt || new Date().toISOString(),
      };

      session.rememberMe = token.rememberMe;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

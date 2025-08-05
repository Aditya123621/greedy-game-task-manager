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

        try {
          const response = await axios.post(
            joinUrl(
              process.env.NEXT_PUBLIC_BACKEND_BASEURL!,
              apiEndPoints.SIGN_IN
            ),
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
    async jwt({ token, user, account, trigger }) {
      if (account?.provider === "google" && user) {
        try {
          const response = await axios.post(
            joinUrl(
              process.env.NEXT_PUBLIC_BACKEND_BASEURL!,
              apiEndPoints.GOOGLE_CALLBACK
            ),
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
            token.createdAt = response.data.user.createdAt;
            token.updatedAt = response.data.user.updatedAt;
          }
        } catch (error) {
          console.error("Google auth callback error:", error);
        }
      }

      if (trigger === "update") {
        try {
          const { data } = await axios.get(
            joinUrl(
              process.env.NEXT_PUBLIC_BACKEND_BASEURL!,
              apiEndPoints.GET_USER_INFO
            ),
            { headers: { Authorization: `Bearer ${token.backendToken}` } }
          );
          token.user = data.user;
          token.updatedAt = data.user.updatedAt;
        } catch (err) {
          console.error("Session update failed", err);
        }
      }

      if (user) {
        token.backendToken = user.token ?? token.backendToken;
        token.id = user.id ?? token.id;
        token.rememberMe = user.rememberMe ?? token.rememberMe;
        token.user = {
          name: user.name ?? "",
          email: user.email ?? "",
          role: user.role ?? "user",
        };
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }

      const now = Math.floor(Date.now() / 1000);
      token.exp = now + (token.rememberMe ? 30 * 86400 : 86400);

      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken;
      session.rememberMe = token.rememberMe;

      session.user = {
        ...session.user,
        id: token.id as string,
        ...token.user,
        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      };

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};

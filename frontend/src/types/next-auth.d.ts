import "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    rememberMe?: boolean;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "user" | "super_admin";
      createdAt: string; 
      updatedAt: string; 
    };
  }

  interface User {
    id: string;
    token?: string;
    rememberMe?: boolean;
    role?: "user" | "super_admin";
    createdAt?: string; 
    updatedAt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    rememberMe?: boolean;
    createdAt?: string; 
    updatedAt?: string; 
    user?: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      googleId?: string;
      role: "user" | "super_admin";
      createdAt: string;
      updatedAt: string; 
    };
  }
}

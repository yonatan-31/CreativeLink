import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/user";
import { compare } from "bcryptjs";
import type { Session, User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { NextAuthConfig } from "next-auth";

// Extend NextAuth's default types to include your custom fields
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    avatarUrl?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      avatarUrl?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    avatarUrl?: string;
  }
}

export const authOptions = {
  providers: [
    // ✅ Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ✅ Credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        await connectDB();

        const user = await User.findOne({ email });
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: NextAuthUser;
      account: Record<string, unknown> | null;
    }) {
      if (account?.provider === "google") {
        await connectDB();

        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          existingUser = await User.create({
            name: user.name,
            email: user.email,
            role: "client",
            avatarUrl: user.image,
          });
        }
        // Attach the user's role so jwt() can access it
        user.id = existingUser._id.toString();
        user.role = existingUser.role;
        user.avatarUrl = existingUser.avatarUrl;
      }
      return true;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatarUrl = token.avatarUrl;
      }
      return session;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: NextAuthUser;
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const nextAuth = NextAuth(authOptions as NextAuthConfig);
export const { handlers, auth, signIn, signOut } = nextAuth;

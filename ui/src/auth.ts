/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import UserSchema from "@/models/User";
import { signInSchema } from "./schemas/signIn";
import client from "./lib/db";

export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate credentials using signInSchema
          const result = signInSchema.safeParse(credentials);
          if (!result.success) {
            return null;
          }
          const user = await UserSchema.findOne({
            email: credentials.email.toString()
          });

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password.toString(),
            user.password
          );
          if (!isPasswordValid) return null;

          // Return user object with id, name, email as strings
          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
          } as User;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is returned from authorize, add its fields to the token
      if (user) {
        token.id = user.id ?? "";
        token.name = user.name ?? "";
        token.email = user.email ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      // Add id, name, email to session.user
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
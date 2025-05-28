/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserSchema from "@/models/User";
import { signInSchema } from "./schemas/signIn";
export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({
  
  session:{
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
          await dbConnect();
         // Validate credentials using signInSchema
          const result = signInSchema.safeParse(credentials);
          if (!result.success) {
            // Optionally, you can log or handle validation errors here
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

          return {
            _id: user._id.toString(),
            email: user.email,
            name: user.fullName,
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
      if (user) {
        token._id = user._id;
        token.name = user.name ?? "";
        token.email = user.email ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
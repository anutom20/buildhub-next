// @/auth.ts

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // get user from db with the email
        // if there is no user with the email, create new user
        // else set the user data to token
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        // set the token data to session
      }
      if (session?.user) {
        session.user.id = token.sub!;
      }

      return session;
    },

    redirect() {
      return "/auth/login";
    },
  },
});

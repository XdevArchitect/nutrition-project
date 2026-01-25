import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { validateSessionLimit, createUserSession, getOrCreateDeviceId } from "@/lib/session-manager";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Trong thực tế, bạn sẽ kiểm tra thông tin đăng nhập với cơ sở dữ liệu
        if (credentials.username === "admin" && credentials.password === "admin123") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }

        // For regular users, check against database
        const user = await prisma.user.findUnique({
          where: { email: credentials.username as string }
        });

        if (user && credentials.password === "user123") { // Simplified password check
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Handle session updates
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        
        // Check device session limit for non-admin users
        if (token.role !== "ADMIN") {
          const deviceId = getOrCreateDeviceId();
          const sessionValidation = await validateSessionLimit(token.id as string, deviceId);
          
          // Attach session validation info to session
          (session as any).canCreateSession = sessionValidation.canCreateSession;
          (session as any).sessionMessage = sessionValidation.message;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Create session tracking when user signs in
      if (user?.id) {
        const deviceId = getOrCreateDeviceId();
        // In a real implementation, you would get IP and User Agent from request headers
        await createUserSession(user.id, deviceId);
      }
    },
    async signOut() {
      // Cleanup logic when user signs out
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { validateSessionLimit, createUserSession, getOrCreateDeviceId } from "@/lib/session-manager";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Authorize called with credentials:", credentials);
        
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          return null;
        }

        // Tìm user trong database theo username hoặc email
        const user = await prisma.user.findFirst({
          where: { 
            OR: [
              { email: credentials.username },
              { username: credentials.username }
            ]
          }
        });

        console.log("User found:", user);

        // Nếu không tìm thấy user hoặc password không khớp
        if (!user || !user.password) {
          console.log("User not found or no password");
          return null;
        }

        // Kiểm tra password
        console.log("Comparing passwords...");
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        console.log("Password valid:", isValidPassword);
        
        if (!isValidPassword) {
          console.log("Invalid password");
          return null;
        }

        // Trả về thông tin user nếu xác thực thành công
        console.log("Authentication successful for user:", user);
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login" // Trang error cũng redirect về login
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
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
    async session({ session, token }: any) {
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
    async redirect({ url, baseUrl }: any) {
      // Nếu là callback từ login, redirect về dashboard
      if (url.startsWith(baseUrl)) {
        const parsedUrl = new URL(url, baseUrl);
        if (parsedUrl.searchParams.has('callbackUrl')) {
          const callbackUrl = parsedUrl.searchParams.get('callbackUrl');
          // Nếu callbackUrl là /admin, redirect về /admin/dashboard để tránh vòng lặp
          if (callbackUrl === '/admin') {
            return `${baseUrl}/admin/dashboard`;
          }
          if (callbackUrl && callbackUrl.startsWith('/admin')) {
            return callbackUrl;
          }
        }
      }
      
      // Default redirect cho admin
      if (url.startsWith("/admin")) {
        return url;
      }
      
      // Default redirect về dashboard cho admin
      return `${baseUrl}/admin/dashboard`;
    }
  },
  events: {
    async signIn({ user, account }: any) {
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Kiểm tra nếu là route admin thì phải có role ADMIN
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      
      // Nếu không có token hoặc không phải admin thì redirect về login
      if (!token || token.role !== 'ADMIN') {
        // Tránh redirect loop khi đã ở trang login
        if (req.nextUrl.pathname === '/admin/login') {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/admin/login',
      error: '/admin/login'
    }
  }
);

export const config = {
  matcher: [
    "/admin/:path*", // Match all admin paths
  ],
};
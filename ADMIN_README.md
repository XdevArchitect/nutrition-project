# Trang Quản Trị

Dự án này bao gồm một hệ thống quản trị với các tính năng sau:

## Cấu trúc thư mục

```
app/
  admin/
    page.tsx          # Trang chính của admin (sử dụng xác thực cookie)
    login/
      page.tsx        # Trang đăng nhập
    dashboard/
      page.tsx        # Bảng điều khiển quản trị
  api/
    auth/
      [...nextauth]/
        route.ts      # Cấu hình NextAuth
```

## Cách sử dụng

1. Truy cập trang quản trị: `/admin`
2. Nếu chưa đăng nhập, bạn sẽ được chuyển hướng đến trang đăng nhập: `/admin/login`
3. Sử dụng thông tin sau để đăng nhập:
   - Tên đăng nhập: `admin`
   - Mật khẩu: `admin123`

## Xác thực

Dự án sử dụng hai phương pháp xác thực:

1. **NextAuth.js**: Cho trang đăng nhập mới (`/admin/login` và `/admin/dashboard`)
2. **Cookie-based**: Cho trang admin hiện có (`/admin`)

## Biến môi trường

Tạo file `.env.local` với các biến sau:

```
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
ADMIN_SECRET=your_admin_secret_here
```

## Tùy chỉnh

Để thay đổi thông tin đăng nhập, hãy cập nhật file:
- `app/api/auth/[...nextauth]/route.ts` (cho NextAuth)
- `app/admin/page.tsx` (cho xác thực cookie-based)
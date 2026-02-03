# Dinh Dưỡng Tối Ưu - Nền tảng học trực tuyến về dinh dưỡng

Dự án Dinh Dưỡng Tối Ưu là một nền tảng giáo dục trực tuyến chuyên về dinh dưỡng và sức khỏe, được xây dựng với Next.js 14 và TypeScript. Hệ thống cung cấp các khóa học về dinh dưỡng, cho phép người dùng đăng ký, xem video bài giảng và tương tác với nội dung giáo dục.

## 🌟 Tính năng chính

### Người dùng công khai
- **Trang chủ**: Giới thiệu chuyên gia, khóa học nổi bật, kiến thức miễn phí
- **Khóa học**: Xem danh sách và chi tiết khóa học
- **Kiến thức**: Truy cập các bài viết về dinh dưỡng
- **Liên hệ**: Form đăng ký tư vấn và thông tin liên hệ

### Người dùng đã đăng nhập
- **Đăng nhập/Đăng xuất**: Xác thực người dùng
- **Khóa học đã đăng ký**: Xem nội dung khóa học đã mua
- **Video bài giảng**: Xem video theo khóa học
- **Hồ sơ cá nhân**: Quản lý thông tin tài khoản

### Quản trị viên
- **Dashboard**: Thống kê tổng quan về người dùng, khóa học, video
- **Quản lý người dùng**: Tạo, sửa, xóa tài khoản người dùng
- **Quản lý khóa học**: Tạo và quản lý các khóa học
- **Quản lý video**: Upload và quản lý video bài giảng
- **Thống kê**: Báo cáo về hoạt động hệ thống

## 🛠 Công nghệ sử dụng

### Framework & Ngôn ngữ
- **Next.js 14** với App Router
- **TypeScript** cho type safety
- **React 18** cho giao diện người dùng

### Cơ sở dữ liệu
- **MySQL** với **Prisma ORM**
- **bcryptjs** cho mã hóa mật khẩu

### Xác thực & Phân quyền
- **NextAuth.js** cho xác thực người dùng
- **Middleware** để kiểm tra quyền truy cập

### UI Components
- **shadcn/ui** làm base components
- **Tailwind CSS** cho styling
- **Radix UI** cho các component core
- **Lucide React** cho icons

### Các thư viện hỗ trợ
- **SWR** cho data fetching và caching
- **Sonner** cho toast notifications
- **date-fns** cho xử lý ngày tháng
- **nanoid** cho tạo ID ngẫu nhiên

## 🏗 Kiến trúc dự án

```
/app
  /(public)          # Trang công khai cho người dùng
    /courses         # Danh sách và chi tiết khóa học
    /knowledge       # Kiến thức dinh dưỡng
    /contact         # Form liên hệ
    /login           # Đăng nhập người dùng
    /profile         # Hồ sơ người dùng
  /(admin)           # Trang quản trị
    /admin
      /dashboard     # Dashboard tổng quan
      /users         # Quản lý người dùng
      /courses       # Quản lý khóa học
      /videos        # Quản lý video
      /login         # Đăng nhập admin
  /api               # API routes
    /auth            # Xác thực người dùng
    /admin           # API quản trị
    /video           # API video
    /lead            # API lead capture

/lib                 # Utilities và helpers
/components          # UI components
/public              # Static assets
/prisma              # Prisma schema và migrations
```

## 🔐 Bảo mật & Bảo vệ nội dung

### Giới hạn thiết bị
- Mỗi người dùng chỉ có thể đăng nhập tối đa trên 2 thiết bị
- Hệ thống theo dõi session và giới hạn concurrent sessions

### Giới hạn lượt xem
- Mỗi video có giới hạn 10 lần xem
- Hệ thống theo dõi số lần xem của từng người dùng

### Chống download video
- Video được embed từ YouTube để tránh download trực tiếp
- **MỚI**: Hỗ trợ upload video trực tiếp lên server để phát trực tiếp
- Hệ thống theo dõi view count để ngăn chặn abuse

## 📊 Mô hình dữ liệu

### Models chính
- **User**: Người dùng với các vai trò (STUDENT, MENTOR, ADMIN)
- **Course**: Khóa học với trạng thái (DRAFT, PUBLISHED, ARCHIVED)
- **Video**: Video bài giảng thuộc khóa học
- **CourseEnrollment**: Đăng ký khóa học
- **UserSession**: Quản lý phiên đăng nhập (giới hạn thiết bị)
- **VideoView**: Theo dõi lượt xem video (giới hạn số lần)

## 🚀 Cách chạy dự án

### Yêu cầu hệ thống
- Node.js 18.x hoặc cao hơn
- MySQL 8.x
- Bun (package manager)

### Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd nutrition-site
```

2. **Cài đặt dependencies**
```bash
bun install
```

3. **Thiết lập biến môi trường**
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa các biến môi trường:
```env
# Database connection
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# NextAuth configuration
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Admin secret (optional)
ADMIN_SECRET="your_admin_secret"
```

4. **Thiết lập cơ sở dữ liệu**
```bash
# Tạo migration đầu tiên (nếu cần)
bunx prisma migrate dev --name init

# Hoặc đồng bộ schema với database hiện tại
bunx prisma db push

# Tạo dữ liệu mẫu (nếu cần)
bun scripts/create-admin-user.js
```

5. **Chạy development server**
```bash
bun run dev
```

### Các lệnh Prisma hữu ích

```bash
# Tạo migration mới
bunx prisma migrate dev --name migration_name

# Áp dụng migrations
bunx prisma migrate deploy

# Tạo client Prisma
bunx prisma generate

# Xem studio Prisma
bunx prisma studio

# Reset database (chỉ dùng cho development)
bunx prisma migrate reset
```

### Scripts hữu ích

```bash
# Tạo tài khoản admin mặc định
bun scripts/create-admin-user.js

# Kiểm tra tài khoản admin tồn tại
bun scripts/check-admin-exists.js
```

## 👤 Tài khoản admin mặc định

Sau khi chạy script `create-admin-user.js`:
- **Username**: admin
- **Password**: admin123@
- **Role**: ADMIN

## 🎨 Base Components

Dự án sử dụng [shadcn/ui](https://ui.shadcn.com/) làm base components, bao gồm:

### Layout Components
- Card, Container, Grid
- Navigation Menu, Sidebar
- Header, Footer

### Form Components
- Button, Input, Textarea
- Select, Checkbox, Radio
- Form, Label

### Data Display
- Table, Badge, Avatar
- Alert, Toast
- Accordion, Tabs

### Interactive Components
- Dialog, Sheet
- Dropdown Menu
- Scroll Area

### Navigation
- Breadcrumb
- Pagination
- Tabs

## 🔄 Logic chuyển hướng Admin

1. **Khi truy cập `/admin`**:
   - Nếu chưa đăng nhập → redirect về `/admin/login`
   - Nếu đã đăng nhập với role ADMIN → redirect về `/admin/dashboard`
   - Nếu đã đăng nhập với role USER → redirect về trang chủ `/`

2. **Middleware kiểm tra**:
   - Tất cả các route `/admin/*` đều yêu cầu xác thực
   - Chỉ role ADMIN mới có thể truy cập vào khu vực admin

## 📁 Cấu trúc thư mục admin chi tiết

```
/app/(admin)
  /admin
    /dashboard       # Dashboard tổng quan
      /users         # Quản lý người dùng
      /courses       # Quản lý khóa học
      /videos        # Quản lý video
      /analytics     # Thống kê và báo cáo
    /login           # Trang đăng nhập admin
    /page.tsx        # Logic redirect
  /layout.tsx        # Admin layout với sidebar và header
```

## 🧪 Testing

### Testing Authentication
```bash
# Test basic auth flow
bun scripts/test-auth.js

# Test NextAuth setup
bun scripts/test-nextauth.js
```

## 📈 Monitoring & Logging

- Console logging trong development
- Error tracking với Sentry (có thể tích hợp)
- Performance monitoring với các tools như Lighthouse

## 🚢 Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

### Docker
```bash
# Build image
docker build -t nutrition-site .

# Run container
docker run -p 3000:3000 nutrition-site
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

Nếu bạn gặp bất kỳ vấn đề nào, vui lòng:
1. Kiểm tra Issues trên repository
2. Tạo issue mới nếu cần hỗ trợ
3. Liên hệ team phát triển qua email hỗ trợ
import {cookies} from "next/headers";
import {createHash} from "crypto";
import type {Metadata} from "next";
import {prisma} from "@/lib/prisma";
import {AdminLoginForm} from "@/components/admin-login-form";
import {AdminToolbar} from "@/components/admin-toolbar";
import {AdminCourseManager} from "@/components/admin-course-manager";
import {AdminUserManager} from "@/components/admin-user-manager";
import {Card, CardContent} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin",
  description: "Quản lý lead và khoá học"
};

export const dynamic = "force-dynamic";

const COOKIE_NAME = "admin-session";

const expectedHash = () => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest("hex");
};

export default async function AdminPage() {
  const expected = expectedHash();
  const session = cookies().get(COOKIE_NAME)?.value;

  if (!expected) {
    return (
      <div className="container max-w-2xl space-y-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-primary">Cần cấu hình ADMIN_SECRET</h1>
        <p className="text-sm text-muted-foreground">Thêm biến môi trường ADMIN_SECRET để kích hoạt trang quản trị.</p>
      </div>
    );
  }

  if (session !== expected) {
    return (
      <div className="container max-w-md space-y-8 py-20">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold text-primary">Đăng nhập quản trị</h1>
          <p className="text-sm text-muted-foreground">Nhập mã bí mật do đội ngũ cung cấp.</p>
        </div>
        <Card className="border-primary/10 bg-white/85">
          <CardContent className="p-8">
            <AdminLoginForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  const leads = await prisma.lead.findMany({orderBy: {createdAt: "desc"}});

  return (
    <div className="container space-y-12 py-16">
      <AdminToolbar leadCount={leads.length} />
      <Card className="border-primary/10 bg-white/90">
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-primary/10 text-sm">
            <thead className="bg-primary/5 text-left text-xs uppercase tracking-wide text-primary">
              <tr>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Số điện thoại</th>
                <th className="px-6 py-3">Mục tiêu</th>
                <th className="px-6 py-3">Tin nhắn</th>
                <th className="px-6 py-3">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-primary/5">
                  <td className="px-6 py-4 font-medium text-primary-900">{lead.name}</td>
                  <td className="px-6 py-4">
                    <a href={`mailto:${lead.email}`} className="text-primary underline-offset-4 hover:underline">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.reason}</td>
                  <td className="px-6 py-4 text-muted-foreground">{lead.message}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{lead.createdAt.toLocaleString()}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Chưa có lead nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <AdminCourseManager />
      <AdminUserManager />
    </div>
  );
}

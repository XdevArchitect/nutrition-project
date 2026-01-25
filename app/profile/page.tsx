import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserActiveSessions } from "@/lib/session-manager";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { LogOut, Monitor, Smartphone, Tablet } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Get user's active sessions
  const activeSessions = await getUserActiveSessions(session.user.id);
  
  // Get user's course enrollments
  const enrollments = await prisma.courseEnrollment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      course: {
        select: {
          title: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  // Determine device type based on user agent (simplified)
  const getDeviceType = (userAgent?: string) => {
    if (!userAgent) return "desktop";
    
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    return "desktop";
  };
  
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="container py-8 pb-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-primary">Thông tin cá nhân</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và khóa học của bạn</p>
        
        <div className="mt-8 space-y-6">
          <Card className="border-primary/15 bg-white/80">
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
              <CardDescription>
                Thông tin cơ bản về tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Họ và tên</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại tài khoản</p>
                  <p className="font-medium capitalize">
                    {session.user.role === "ADMIN" ? "Quản trị viên" : "Học viên"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tham gia</p>
                  <p className="font-medium">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/15 bg-white/80">
            <CardHeader>
              <CardTitle>Thiết bị đang đăng nhập</CardTitle>
              <CardDescription>
                Quản lý các thiết bị đang sử dụng tài khoản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeSessions.length === 0 ? (
                <p className="text-muted-foreground">Không có thiết bị nào đang đăng nhập</p>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session) => {
                    const deviceType = getDeviceType(session.userAgent);
                    return (
                      <div key={session.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(deviceType)}
                          <div>
                            <p className="font-medium">
                              {deviceType === "mobile" ? "Điện thoại" : 
                               deviceType === "tablet" ? "Máy tính bảng" : "Máy tính"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Đăng nhập lần cuối: {format(new Date(session.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Đăng xuất
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-primary/15 bg-white/80">
            <CardHeader>
              <CardTitle>Khóa học đã đăng ký</CardTitle>
              <CardDescription>
                Danh sách các khóa học bạn đã đăng ký
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground">Bạn chưa đăng ký khóa học nào</p>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{enrollment.course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Ngày đăng ký: {format(new Date(enrollment.createdAt), "dd/MM/yyyy", { locale: vi })}
                        </p>
                      </div>
                      <Button asChild>
                        <a href={`/courses/${enrollment.course.id}`}>Xem khóa học</a>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
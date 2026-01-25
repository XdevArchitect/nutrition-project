'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut, useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    // Đăng xuất và chuyển hướng về trang login
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra xác thực...</div>;
  }

  // Nếu chưa đăng nhập, không hiển thị nội dung
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bảng điều khiển quản trị</h1>
          <Button onClick={handleLogout} variant="outline">
            Đăng xuất
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê người dùng</CardTitle>
              <CardDescription>Tổng quan về người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-center py-4">1,234</p>
              <p className="text-center text-muted-foreground">Người dùng đã đăng ký</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê khóa học</CardTitle>
              <CardDescription>Tổng quan về khóa học</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-center py-4">56</p>
              <p className="text-center text-muted-foreground">Khóa học đang hoạt động</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doanh thu</CardTitle>
              <CardDescription>Doanh thu tháng này</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-center py-4">12,345,678₫</p>
              <p className="text-center text-muted-foreground">Tăng 12% so với tháng trước</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các hoạt động quản trị gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
                    <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Người dùng mới đăng ký</p>
                    <p className="text-sm text-muted-foreground">Nguyễn Văn A đã đăng ký tài khoản</p>
                  </div>
                  <span className="ml-auto text-sm text-muted-foreground">2 phút trước</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                    <div className="bg-blue-500 w-2 h-2 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Khóa học mới được tạo</p>
                    <p className="text-sm text-muted-foreground">Khóa học "Dinh dưỡng cho người mới bắt đầu" đã được tạo</p>
                  </div>
                  <span className="ml-auto text-sm text-muted-foreground">1 giờ trước</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-4">
                    <div className="bg-purple-500 w-2 h-2 rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-medium">Thanh toán mới</p>
                    <p className="text-sm text-muted-foreground">Người dùng đã thanh toán cho khóa học</p>
                  </div>
                  <span className="ml-auto text-sm text-muted-foreground">3 giờ trước</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
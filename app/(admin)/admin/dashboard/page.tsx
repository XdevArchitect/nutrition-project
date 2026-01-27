'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  Video, 
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Eye,
  Play,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  const router = useRouter();
  const { data: statsData, error: statsError } = useSWR('/api/admin/stats', fetcher);
  const { data: usersData, error: usersError } = useSWR('/api/admin/users', fetcher);
  const { data: coursesData, error: coursesError } = useSWR('/api/admin/courses', fetcher);
  const { data: videosData, error: videosError } = useSWR('/api/admin/videos', fetcher);

  // Calculate statistics from API data
  const stats = statsData?.stats || {};
  const totalUsers = stats.totalUsers || 0;
  const totalCourses = stats.totalCourses || 0;
  const totalVideos = stats.totalVideos || 0;
  const publishedCourses = stats.publishedCourses || 0;
  const recentUsers = stats.recentUsers || 0;
  const totalEnrollments = stats.totalEnrollments || 0;
  const videoViews = stats.videoViews || 0;
  
  // Calculate total revenue (mock data for now, as we don't have actual payment data)
  const totalRevenue = totalUsers * 500000; // Assuming 500,000 VND per user
  
  // Calculate recent activities (mock data for now)
  const recentActivities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "đã đăng ký khóa học",
      course: "Dinh dưỡng cho người mới bắt đầu",
      time: "2 phút trước"
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "đã xem video",
      course: "Thực đơn giảm cân hiệu quả",
      time: "15 phút trước"
    },
    {
      id: 3,
      user: "Phạm Văn C",
      action: "đã thanh toán",
      course: "Kế hoạch dinh dưỡng cá nhân hóa",
      time: "1 giờ trước"
    },
    {
      id: 4,
      user: "Lê Thị D",
      action: "đã hoàn thành bài test",
      course: "Dinh dưỡng thể thao",
      time: "3 giờ trước"
    }
  ];

  // Calculate popular courses (mock data for now)
  const popularCourses = coursesData?.courses?.slice(0, 3).map((course: any) => ({
    id: course.id,
    title: course.title,
    students: course.enrollments?.length || 0,
    views: course.videos?.reduce((acc: number, video: any) => acc + (video.views?.length || 0), 0) || 0,
    revenue: (course.enrollments?.length || 0) * 200000 // Assuming 200,000 VND per enrollment
  })) || [];

  const dashboardStats = [
    {
      title: "Tổng người dùng",
      value: totalUsers.toLocaleString(),
      change: `+${recentUsers}`,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Khóa học",
      value: totalCourses,
      change: `+${publishedCourses}`,
      icon: BookOpen,
      color: "bg-green-500"
    },
    {
      title: "Video bài giảng",
      value: totalVideos,
      change: `+${videoViews}`,
      icon: Video,
      color: "bg-purple-500"
    },
    {
      title: "Doanh thu",
      value: `${totalRevenue.toLocaleString()}₫`,
      change: "+15%",
      icon: DollarSign,
      color: "bg-yellow-500"
    }
  ];

  const quickActions = [
    {
      title: "Quản lý người dùng",
      description: "Thêm, chỉnh sửa và xóa tài khoản người dùng",
      icon: Users,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      onClick: () => router.push('/admin/dashboard/users')
    },
    {
      title: "Quản lý khóa học",
      description: "Tạo và quản lý các khóa học và nội dung",
      icon: BookOpen,
      color: "bg-green-100",
      iconColor: "text-green-600",
      onClick: () => router.push('/admin/dashboard/courses')
    },
    {
      title: "Quản lý video",
      description: "Upload và quản lý video bài giảng",
      icon: Video,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      onClick: () => router.push('/admin/dashboard/videos')
    },
    {
      title: "Thống kê doanh thu",
      description: "Xem báo cáo doanh thu và thống kê",
      icon: DollarSign,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
      onClick: () => router.push('/admin/dashboard/analytics')
    }
  ];

  // Check if any data is loading
  const isLoading = (!statsData && !statsError) || 
                   (!usersData && !usersError) || 
                   (!coursesData && !coursesError) || 
                   (!videosData && !videosError);

  // Check if any data has errors
  const hasError = statsError || usersError || coursesError || videosError;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
        <p className="text-gray-600 mt-2">Tổng quan về hoạt động của hệ thống hôm nay.</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              // Refresh all data
              window.location.reload();
            }}
          >
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Stats Cards */}
      {!isLoading && !hasError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-full`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.change} từ tháng trước
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Charts and Activities */}
      {!isLoading && !hasError && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động quản trị gần đây</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Eye className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          <span className="text-primary">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">{activity.course}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Courses */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Khóa học phổ biến</CardTitle>
                <CardDescription>Top khóa học được quan tâm nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularCourses.map((course: any) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm">{course.title}</h3>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <p className="text-gray-500">Học viên</p>
                          <p className="font-medium">{course.students}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Lượt xem</p>
                          <p className="font-medium">{course.views}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Doanh thu</p>
                          <p className="font-medium">{course.revenue.toLocaleString()}₫</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isLoading && !hasError && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Hành động nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                  onClick={action.onClick}
                >
                  <CardHeader>
                    <div className={`${action.color} p-3 rounded-full w-12 h-12 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* System Status */}
      {!isLoading && !hasError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Lịch học sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium">Buổi học: Dinh dưỡng thể thao</p>
                  <p className="text-sm text-gray-600">Ngày: 15/02/2024</p>
                  <p className="text-sm text-gray-600">Giờ: 19:00 - 21:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Thông báo hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <ShoppingCart className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Cập nhật tính năng mới</p>
                    <p className="text-sm text-gray-600">Hệ thống đã thêm tính năng chống download video. Vui lòng kiểm tra lại cài đặt khóa học.</p>
                    <p className="text-xs text-gray-500 mt-1">2 giờ trước</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tăng trưởng người dùng</p>
                    <p className="text-sm text-gray-600">Hệ thống đã đạt mốc 1000 người dùng đăng ký. Chúc mừng đội ngũ!</p>
                    <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
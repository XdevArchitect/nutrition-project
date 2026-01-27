'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  BookOpen,
  Play,
  Users,
  Calendar,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminCourses() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error, isLoading, mutate } = useSWR('/api/admin/courses', fetcher);

  // Filter courses based on search term
  const filteredCourses = data?.courses?.filter((course: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-2">Tạo và quản lý các khóa học dinh dưỡng</p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => router.push('/admin/dashboard/courses/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo khóa học mới
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full md:w-auto">
          <Search className="h-4 w-4 mr-2" />
          Tìm kiếm
        </Button>
      </div>

      {/* Error handling */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.error || "Có lỗi xảy ra khi tải dữ liệu khóa học"}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => mutate()}
          >
            Thử lại
          </Button>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: any) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
                <span className={`absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.status === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-800' 
                    : course.status === 'ARCHIVED'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status === 'PUBLISHED' ? 'Đã xuất bản' : course.status === 'ARCHIVED' ? 'Đã lưu trữ' : 'Bản nháp'}
                </span>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollments?.length || 0} học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{course.videos?.length || 0} video</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => router.push(`/admin/dashboard/courses/${course.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/admin/dashboard/courses/${course.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Statistics */}
      {!isLoading && !error && data?.courses && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng khóa học</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{data.courses.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.courses.filter((c: any) => new Date(c.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} khóa học mới tháng này
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Khóa học đã xuất bản</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {data.courses.filter((c: any) => c.status === 'PUBLISHED').length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Chiếm {data.courses.length > 0 
                  ? Math.round((data.courses.filter((c: any) => c.status === 'PUBLISHED').length / data.courses.length) * 100) 
                  : 0}% tổng số
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng video bài giảng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {data.courses.reduce((acc: number, course: any) => acc + (course.videos?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Tổng số video trong tất cả khóa học
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng học viên</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {data.courses.reduce((acc: number, course: any) => acc + (course.enrollments?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Tổng số học viên đã đăng ký
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
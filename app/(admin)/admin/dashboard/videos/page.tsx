'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play,
  Upload,
  Eye,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminVideos() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { data, error, isLoading, mutate } = useSWR('/api/admin/videos', fetcher);

  // Filter videos based on search term
  const filteredVideos = data?.videos?.filter((video: any) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      video.title.toLowerCase().includes(term) ||
      video.course?.title.toLowerCase().includes(term)
    );
  }) || [];

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý video</h1>
          <p className="text-gray-600 mt-2">Upload và quản lý video bài giảng</p>
        </div>
        <Button className="w-full md:w-auto" onClick={() => router.push('/admin/dashboard/videos/new')}>
          <Upload className="h-4 w-4 mr-2" />
          Upload video mới
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Tìm kiếm video..."
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
            {error.error || "Có lỗi xảy ra khi tải dữ liệu video"}
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

      {/* Videos Table */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách video</CardTitle>
            <CardDescription>
              Tổng cộng {filteredVideos.length} video trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Video</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Khóa học</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Thời lượng</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Lượt xem</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Trạng thái</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Ngày upload</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.map((video: any) => (
                    <tr key={video.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                              <Play className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {video.course?.title || 'Chưa phân loại'}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDuration(video.duration)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {video.views?.length || 0}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          video.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {video.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/admin/dashboard/videos/${video.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Statistics */}
      {!isLoading && !error && data?.videos && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng video</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{data.videos.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {data.videos.filter((v: any) => new Date(v.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} video mới tháng này
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Video đã xuất bản</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {data.videos.filter((v: any) => v.isPublished).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Chiếm {data.videos.length > 0 
                  ? Math.round((data.videos.filter((v: any) => v.isPublished).length / data.videos.length) * 100) 
                  : 0}% tổng số
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tổng lượt xem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">
                {data.videos.reduce((acc: number, video: any) => acc + (video.views?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Tổng lượt xem tất cả video
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thời lượng trung bình</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {data.videos.length > 0 
                  ? formatDuration(
                      Math.floor(
                        data.videos.reduce((acc: number, video: any) => acc + (video.duration || 0), 0) / 
                        data.videos.length
                      )
                    )
                  : '00:00'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                phút/video
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
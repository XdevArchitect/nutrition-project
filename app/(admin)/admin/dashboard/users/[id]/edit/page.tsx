'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    role: UserRole.STUDENT,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setFormData({
            name: data.user.name,
            email: data.user.email || '',
            username: data.user.username || '',
            password: '',
            phone: data.user.phone || '',
            role: data.user.role,
          });
        } else {
          toast.error(data.error || 'Không thể tải thông tin người dùng');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Có lỗi xảy ra khi tải thông tin người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          username: formData.username.trim(),
          password: formData.password.trim() || undefined, // Only send if password is provided
          phone: formData.phone.trim() || null,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Thông tin người dùng đã được cập nhật thành công!');
        router.push('/admin/dashboard/users');
        router.refresh();
      } else {
        // Xử lý các loại lỗi khác nhau
        if (response.status === 401) {
          toast.error('Không được phép - Vui lòng đăng nhập lại với tư cách quản trị viên');
        } else if (response.status === 409) {
          toast.error(data.error || 'Thông tin đã tồn tại trong hệ thống');
        } else {
          toast.error(data.error || 'Có lỗi xảy ra khi cập nhật người dùng');
        }
      }
    } catch (err) {
      console.error('Error updating user:', err);
      toast.error('Có lỗi xảy ra khi kết nối đến máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
          <p className="text-gray-600 mt-2">Đang tải thông tin người dùng...</p>
        </div>
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
        <p className="text-gray-600 mt-2">Cập nhật thông tin tài khoản người dùng</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Thông tin người dùng</CardTitle>
            <CardDescription>
              Cập nhật thông tin chi tiết cho người dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu (để trống nếu không đổi)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                disabled={saving}
                placeholder="Nhập mật khẩu mới (tùy chọn)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.STUDENT}>Học viên</SelectItem>
                  <SelectItem value={UserRole.MENTOR}>Giảng viên</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function AdminPage() {
  // Kiểm tra session server-side
  const session = await getServerSession(authOptions);

  // Nếu chưa đăng nhập, redirect đến trang login
  if (!session) {
    redirect('/admin/login');
  }

  // Nếu đã đăng nhập và là admin, redirect đến dashboard
  if (session.user?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // Nếu là user thường, redirect về trang chủ
  redirect('/');
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export const assertAdmin = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({error: "Không được phép - Vui lòng đăng nhập với tư cách quản trị viên"}, {status: 401});
  }
  
  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({error: "Không được phép - Chỉ quản trị viên mới có thể thực hiện hành động này"}, {status: 403});
  }
  
  return null;
};
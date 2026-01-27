import {Prisma, UserRole} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

type Params = {params: {id: string}};

export async function GET(_: Request, {params}: Params) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const user = await prisma.user.findUnique({
      where: {id: params.id},
      include: {
        enrollments: {include: {course: {select: {id: true, title: true}}}}
      }
    });

    if (!user) {
      return NextResponse.json({error: "Không tìm thấy người dùng"}, {status: 404});
    }

    return NextResponse.json({user});
  } catch (error) {
    console.error("Get user error", error);
    return NextResponse.json({error: "Không thể tải thông tin người dùng"}, {status: 500});
  }
}

export async function PATCH(request: Request, {params}: Params) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      name: string;
      email: string | null;
      username: string;
      password: string;
      phone: string | null;
      role: string;
    }>;

    if (!Object.keys(payload).length) {
      return NextResponse.json({error: "Không có dữ liệu cập nhật"}, {status: 400});
    }

    const data: Record<string, unknown> = {};
    if (payload.name) data.name = payload.name.trim();
    if (payload.email !== undefined) data.email = payload.email?.trim() || null;
    if (payload.username) data.username = payload.username.trim();
    if (payload.phone !== undefined) data.phone = payload.phone?.trim() || null;
    if (payload.role && Object.values(UserRole).includes(payload.role as UserRole)) {
      data.role = payload.role as UserRole;
    }
    
    // Hash password if provided
    if (payload.password) {
      const saltRounds = 10;
      data.password = await bcrypt.hash(payload.password, saltRounds);
    }

    const user = await prisma.user.update({
      where: {id: params.id},
      data,
      include: {
        enrollments: {include: {course: {select: {id: true, title: true}}}}
      }
    });

    return NextResponse.json({user});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({error: "Email hoặc tên đăng nhập đã tồn tại"}, {status: 409});
    }
    console.error("Update user error", error);
    return NextResponse.json({error: "Không thể cập nhật người dùng"}, {status: 500});
  }
}

export async function DELETE(_: Request, {params}: Params) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.user.delete({where: {id: params.id}});
    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Delete user error", error);
    return NextResponse.json({error: "Không thể xoá người dùng"}, {status: 500});
  }
}
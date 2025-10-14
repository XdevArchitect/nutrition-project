import {Prisma, UserRole} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  const users = await prisma.user.findMany({
    orderBy: {createdAt: "desc"},
    include: {
      enrollments: {include: {course: {select: {id: true, title: true}}}}
    }
  });

  return NextResponse.json({users});
}

export async function POST(request: Request) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      name: string;
      email: string;
      phone: string;
      role: string;
    }>;

    if (!payload.name || !payload.email) {
      return NextResponse.json({error: "Thiếu tên hoặc email"}, {status: 400});
    }

    const role = payload.role && Object.values(UserRole).includes(payload.role as UserRole)
      ? (payload.role as UserRole)
      : UserRole.STUDENT;

    const user = await prisma.user.create({
      data: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone?.trim(),
        role
      },
      include: {
        enrollments: {include: {course: {select: {id: true, title: true}}}}
      }
    });

    return NextResponse.json({user}, {status: 201});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({error: "Email đã tồn tại"}, {status: 409});
    }
    console.error("Create user error", error);
    return NextResponse.json({error: "Không thể tạo người dùng"}, {status: 500});
  }
}

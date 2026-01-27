import {Prisma, UserRole} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const unauthorized = await assertAdmin();
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

    // Validate required fields
    if (!payload.name || !payload.username || !payload.password) {
      return NextResponse.json({error: "Thiếu thông tin bắt buộc"}, {status: 400});
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    const role = payload.role && Object.values(UserRole).includes(payload.role as UserRole)
      ? (payload.role as UserRole)
      : UserRole.STUDENT;

    // Xử lý email để đảm bảo null được chấp nhận
    let emailValue = null;
    if (payload.email && payload.email.trim() !== '') {
      emailValue = payload.email.trim();
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name.trim(),
        email: emailValue,
        username: payload.username.trim(),
        password: hashedPassword,
        phone: payload.phone?.trim() || null,
        role
      },
      include: {
        enrollments: {include: {course: {select: {id: true, title: true}}}}
      }
    });

    return NextResponse.json({user}, {status: 201});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({error: "Email hoặc tên đăng nhập đã tồn tại"}, {status: 409});
      }
    }
    console.error("Create user error", error);
    return NextResponse.json({error: "Không thể tạo người dùng"}, {status: 500});
  }
}
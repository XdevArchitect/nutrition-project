import {Prisma} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  const enrollments = await prisma.courseEnrollment.findMany({
    orderBy: {createdAt: "desc"},
    include: {
      user: {select: {id: true, name: true, email: true}},
      course: {select: {id: true, title: true}}
    }
  });

  return NextResponse.json({enrollments});
}

export async function POST(request: Request) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      userId: string;
      courseId: string;
    }>;

    if (!payload.userId || !payload.courseId) {
      return NextResponse.json({error: "Thiếu user hoặc khoá học"}, {status: 400});
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: payload.userId,
        courseId: payload.courseId
      },
      include: {
        user: {select: {id: true, name: true, email: true}},
        course: {select: {id: true, title: true}}
      }
    });

    return NextResponse.json({enrollment}, {status: 201});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({error: "Người dùng đã ghi danh khoá học này"}, {status: 409});
    }
    console.error("Create enrollment error", error);
    return NextResponse.json({error: "Không thể ghi danh"}, {status: 500});
  }
}

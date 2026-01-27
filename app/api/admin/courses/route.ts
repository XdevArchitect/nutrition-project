import {CourseStatus} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const courses = await prisma.course.findMany({
      orderBy: {createdAt: "desc"},
      include: {
        videos: {orderBy: {sortOrder: "asc"}},
        enrollments: {
          include: {user: {select: {id: true, name: true, email: true}}}
        }
      }
    });

    return NextResponse.json({courses});
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({error: "Không thể tải danh sách khóa học"}, {status: 500});
  }
}

export async function POST(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      title: string;
      description: string;
      status: string;
    }>;

    if (!payload.title || !payload.description) {
      return NextResponse.json({error: "Thiếu tiêu đề hoặc mô tả"}, {status: 400});
    }

    const status = payload.status && Object.values(CourseStatus).includes(payload.status as CourseStatus)
      ? (payload.status as CourseStatus)
      : undefined;

    const course = await prisma.course.create({
      data: {
        title: payload.title.trim(),
        description: payload.description.trim(),
        status
      },
      include: {videos: true, enrollments: {include: {user: {select: {id: true, name: true, email: true}}}}}
    });

    return NextResponse.json({course}, {status: 201});
  } catch (error) {
    console.error("Create course error", error);
    return NextResponse.json({error: "Không thể tạo khoá học"}, {status: 500});
  }
}
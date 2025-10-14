import {CourseStatus} from "@prisma/client";
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

type Params = {params: {id: string}};

export async function GET(_: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  const course = await prisma.course.findUnique({
    where: {id: params.id},
    include: {
      videos: {orderBy: {sortOrder: "asc"}},
      enrollments: {include: {user: {select: {id: true, name: true, email: true}}}}
    }
  });

  if (!course) {
    return NextResponse.json({error: "Không tìm thấy khoá học"}, {status: 404});
  }

  return NextResponse.json({course});
}

export async function PATCH(request: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      title: string;
      description: string;
      status: string;
    }>;

    if (!payload.title && !payload.description && !payload.status) {
      return NextResponse.json({error: "Không có dữ liệu cập nhật"}, {status: 400});
    }

    const data: Record<string, unknown> = {};
    if (payload.title) data.title = payload.title.trim();
    if (payload.description) data.description = payload.description.trim();
    if (payload.status && Object.values(CourseStatus).includes(payload.status as CourseStatus)) {
      data.status = payload.status as CourseStatus;
    }

    const course = await prisma.course.update({
      where: {id: params.id},
      data,
      include: {
        videos: {orderBy: {sortOrder: "asc"}},
        enrollments: {include: {user: {select: {id: true, name: true, email: true}}}}
      }
    });

    return NextResponse.json({course});
  } catch (error) {
    console.error("Update course error", error);
    return NextResponse.json({error: "Không thể cập nhật khoá học"}, {status: 500});
  }
}

export async function DELETE(_: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.course.delete({where: {id: params.id}});
    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Delete course error", error);
    return NextResponse.json({error: "Không thể xoá khoá học"}, {status: 500});
  }
}

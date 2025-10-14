import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  const videos = await prisma.video.findMany({
    orderBy: [{courseId: "asc"}, {sortOrder: "asc"}],
    include: {course: {select: {id: true, title: true}}}
  });

  return NextResponse.json({videos});
}

export async function POST(request: Request) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      courseId: string;
      title: string;
      description: string;
      url: string;
      duration: number;
      sortOrder: number;
      isPublished: boolean;
    }>;

    if (!payload.courseId || !payload.title || !payload.url) {
      return NextResponse.json({error: "Thiếu thông tin bắt buộc"}, {status: 400});
    }

    const video = await prisma.video.create({
      data: {
        courseId: payload.courseId,
        title: payload.title.trim(),
        url: payload.url.trim(),
        description: payload.description?.trim(),
        duration: typeof payload.duration === "number" ? payload.duration : undefined,
        sortOrder: typeof payload.sortOrder === "number" ? payload.sortOrder : undefined,
        isPublished: typeof payload.isPublished === "boolean" ? payload.isPublished : undefined
      },
      include: {course: {select: {id: true, title: true}}}
    });

    return NextResponse.json({video}, {status: 201});
  } catch (error) {
    console.error("Create video error", error);
    return NextResponse.json({error: "Không thể tạo video"}, {status: 500});
  }
}

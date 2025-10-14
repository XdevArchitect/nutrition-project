import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

type Params = {params: {id: string}};

export async function PATCH(request: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = (await request.json()) as Partial<{
      title: string;
      description: string;
      url: string;
      duration: number;
      sortOrder: number;
      isPublished: boolean;
    }>;

    if (!Object.keys(payload).length) {
      return NextResponse.json({error: "Không có dữ liệu cập nhật"}, {status: 400});
    }

    const data: Record<string, unknown> = {};
    if (payload.title) data.title = payload.title.trim();
    if (payload.description !== undefined) data.description = payload.description?.trim() ?? null;
    if (payload.url) data.url = payload.url.trim();
    if (typeof payload.duration === "number") data.duration = payload.duration;
    if (typeof payload.sortOrder === "number") data.sortOrder = payload.sortOrder;
    if (typeof payload.isPublished === "boolean") data.isPublished = payload.isPublished;

    const video = await prisma.video.update({
      where: {id: params.id},
      data,
      include: {course: {select: {id: true, title: true}}}
    });

    return NextResponse.json({video});
  } catch (error) {
    console.error("Update video error", error);
    return NextResponse.json({error: "Không thể cập nhật video"}, {status: 500});
  }
}

export async function DELETE(_: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.video.delete({where: {id: params.id}});
    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Delete video error", error);
    return NextResponse.json({error: "Không thể xoá video"}, {status: 500});
  }
}

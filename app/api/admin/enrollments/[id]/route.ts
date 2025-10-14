import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {assertAdmin} from "@/lib/admin-auth";

type Params = {params: {id: string}};

export async function DELETE(_: Request, {params}: Params) {
  const unauthorized = assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.courseEnrollment.delete({where: {id: params.id}});
    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Delete enrollment error", error);
    return NextResponse.json({error: "Không thể huỷ ghi danh"}, {status: 500});
  }
}

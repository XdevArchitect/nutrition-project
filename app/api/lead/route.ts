import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      name: string;
      email: string;
      phone: string;
      reason: string;
      message: string;
    }>;

    if (!body.name || !body.email || !body.phone || !body.reason || !body.message) {
      return NextResponse.json({error: "Thiếu thông tin"}, {status: 400});
    }

    await prisma.lead.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        reason: body.reason.trim(),
        message: body.message.trim()
      }
    });

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Lead submission error", error);
    return NextResponse.json({error: "Không thể lưu thông tin"}, {status: 500});
  }
}

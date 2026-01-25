import { cookies } from "next/headers";
import { createHash } from "crypto";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin-session";

const expectedHash = () => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret).digest("hex");
};

export async function POST(request: Request) {
  const expected = expectedHash();
  if (!expected) {
    return NextResponse.json({ error: "Chưa cấu hình ADMIN_SECRET" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Thiếu mã bí mật" }, { status: 400 });
    }

    const actual = createHash("sha256").update(token).digest("hex");
    if (actual !== expected) {
      return NextResponse.json({ error: "Mã bí mật không đúng" }, { status: 401 });
    }

    // Đặt cookie với thời gian hết hạn 1 ngày
    const cookieStore = cookies();
    cookieStore.set(COOKIE_NAME, actual, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
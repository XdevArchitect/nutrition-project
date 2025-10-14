import {NextResponse} from "next/server";
import {createHash} from "crypto";

const COOKIE_NAME = "admin-session";

const hashedSecret = () => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("Missing ADMIN_SECRET env");
  }
  return createHash("sha256").update(secret).digest("hex");
};

export async function POST(request: Request) {
  try {
    const {token} = (await request.json()) as {token?: string};
    if (!token) {
      return NextResponse.json({error: "Thiếu mã"}, {status: 400});
    }
    if (!process.env.ADMIN_SECRET) {
      return NextResponse.json({error: "ADMIN_SECRET chưa được cấu hình"}, {status: 500});
    }
    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.json({error: "Sai mã truy cập"}, {status: 401});
    }
    const value = hashedSecret();
    const response = NextResponse.json({success: true});
    response.cookies.set({
      name: COOKIE_NAME,
      value,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });
    return response;
  } catch (error) {
    console.error("Admin session POST", error);
    return NextResponse.json({error: "Không thể tạo phiên"}, {status: 500});
  }
}

export async function DELETE() {
  const response = NextResponse.json({success: true});
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
  return response;
}

import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import {createHash} from "crypto";

const COOKIE_NAME = "admin-session";

const expectedHash = () => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return null;
  }
  return createHash("sha256").update(secret).digest("hex");
};

export const assertAdmin = () => {
  const expected = expectedHash();
  if (!expected) {
    return NextResponse.json({error: "ADMIN_SECRET chưa được cấu hình"}, {status: 500});
  }
  const session = cookies().get(COOKIE_NAME)?.value;
  if (session !== expected) {
    return NextResponse.json({error: "Không được phép"}, {status: 401});
  }
  return null;
};

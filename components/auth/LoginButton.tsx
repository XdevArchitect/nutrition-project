"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function LoginButton() {
  return (
    <Button asChild className="rounded-2xl px-5">
      <Link href="/login" aria-label="Đăng nhập">
        <LogIn className="mr-2 h-4 w-4" />
        Đăng nhập
      </Link>
    </Button>
  );
}

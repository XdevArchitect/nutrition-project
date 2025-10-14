"use client";

import {useTransition} from "react";
import {Button} from "@/components/ui/button";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      await fetch("/api/admin/session", {method: "DELETE"});
      window.location.reload();
    });
  };

  return (
    <Button variant="secondary" onClick={logout} disabled={isPending}>
      {isPending ? "Đang thoát..." : "Đăng xuất"}
    </Button>
  );
}

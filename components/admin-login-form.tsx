"use client";

import {useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export function AdminLoginForm() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setError(null);
      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({token})
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error((payload as {error?: string}).error ?? "Đăng nhập thất bại");
        }
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-600">Mã bí mật</span>
        <Input
          value={token}
          onChange={event => setToken(event.target.value)}
          placeholder="Nhập mã"
          required
        />
      </label>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}

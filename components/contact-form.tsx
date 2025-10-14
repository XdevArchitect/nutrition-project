"use client";

import {useState, useTransition} from "react";
import {Check} from "lucide-react";
import {contactReasons} from "@/data/content";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";

type FormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  reason: contactReasons[0],
  message: ""
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setState(prev => ({...prev, [field]: event.target.value}));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      setSuccess(null);
      setError(null);
      try {
        const response = await fetch("/api/lead", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(state)
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error((payload as {error?: string}).error ?? "Không thể gửi thông tin");
        }
        setState(initialState);
        setSuccess("Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 24 giờ.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <Label>Họ và tên</Label>
          <Input required placeholder="Nguyễn Lan Anh" value={state.name} onChange={handleChange("name")} />
        </label>
        <label className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input required type="email" placeholder="ban@example.com" value={state.email} onChange={handleChange("email")} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <Label>Số điện thoại</Label>
          <Input required placeholder="0987 123 456" value={state.phone} onChange={handleChange("phone")} />
        </label>
        <label className="flex flex-col gap-2">
          <Label>Mục tiêu</Label>
          <select className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary" value={state.reason} onChange={handleChange("reason")}>
            {contactReasons.map(reason => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <Label>Nội dung</Label>
        <Textarea required rows={5} placeholder="Chia sẻ thêm về tình trạng hiện tại của bạn" value={state.message} onChange={handleChange("message")} />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" className="rounded-full" disabled={isPending}>
          {isPending ? "Đang gửi..." : "Gửi thông tin"}
        </Button>
        {success ? (
          <p className="flex items-center gap-2 text-sm text-primary">
            <Check className="h-4 w-4" /> {success}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : null}
      </div>
    </form>
  );
}

import type {Metadata} from "next";
import {ContactForm} from "@/components/contact-form";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Đặt lịch tư vấn dinh dưỡng cá nhân hoá hoặc hợp tác cùng đội ngũ chuyên gia."
};

export default function ContactPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="container space-y-6 pt-10">
        <Badge className="bg-primary/10 text-primary">Liên hệ</Badge>
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-semibold text-primary-900">Kể cho chúng tôi về mục tiêu của bạn</h1>
          <p className="text-base text-muted-foreground">
            Đội ngũ chuyên gia sẽ phản hồi trong vòng 24 giờ để tư vấn lộ trình phù hợp hoặc trao đổi cơ hội hợp tác.
          </p>
        </div>
      </section>
      <section className="container grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border-primary/10 bg-white/85">
          <CardContent className="p-8">
            <ContactForm />
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/10">
          <CardContent className="space-y-4 p-8 text-sm text-muted-foreground">
            <p className="text-base font-semibold text-primary">Chúng tôi có thể hỗ trợ:</p>
            <ul className="space-y-2">
              <li>• Thiết kế thực đơn và coaching cá nhân</li>
              <li>• Workshop dinh dưỡng cho doanh nghiệp</li>
              <li>• Sản xuất nội dung truyền thông về sức khoẻ</li>
              <li>• Hợp tác cùng chuyên gia xuất hiện tại sự kiện</li>
            </ul>
            <div className="rounded-2xl bg-white/70 p-5 text-primary">
              <p className="text-sm font-semibold">Hotline</p>
              <p className="text-lg font-bold">0989 234 567</p>
              <p className="mt-3 text-sm font-semibold">Email</p>
              <a href="mailto:hello@dinhduongtoiuu.com" className="text-sm underline">
                hello@dinhduongtoiuu.com
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

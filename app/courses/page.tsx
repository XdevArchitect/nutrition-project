import type {Metadata} from "next";
import {CheckCircle2, Clock3, Users, Video} from "lucide-react";
import {courseInfo} from "@/data/content";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Khoá học",
  description: "Khoá học dinh dưỡng cá nhân hoá 6 tuần giúp bạn thiết lập chế độ ăn và lối sống bền vững."
};

const stats = [
  {label: "Video bài giảng", value: "24", icon: Video},
  {label: "Thời lượng", value: "6 tuần", icon: Clock3},
  {label: "Cố vấn", value: "3 chuyên gia", icon: Users}
];

export default function CoursesPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="container grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Badge className="bg-secondary/20 text-secondary-foreground">Khoá học cá nhân hoá</Badge>
          <h1 className="text-4xl font-semibold text-primary-900">{courseInfo.name}</h1>
          <p className="text-base text-muted-foreground">{courseInfo.description}</p>
          <div className="flex flex-wrap gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center gap-3 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-medium text-primary">
                <stat.icon className="h-4 w-4" /> {stat.label}: {stat.value}
              </div>
            ))}
          </div>
          <Button size="lg" className="rounded-full">Đăng ký ngay</Button>
        </div>
        <Card className="border-primary/15 bg-white/85">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Bạn nhận được gì</CardTitle>
            <CardDescription>Trọn bộ tài nguyên và hỗ trợ đi kèm trong suốt thời gian học.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            {courseInfo.bonuses.map(item => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="container grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="border-primary/10 bg-white/80">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">Chi tiết chương trình</CardTitle>
            <CardDescription>Hoàn thành mỗi phần, bạn sẽ có checklist rõ ràng và phiên trao đổi với mentor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            {courseInfo.modules.map((module, index) => (
              <div key={module.title} className="rounded-3xl border border-primary/10 bg-primary/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Giai đoạn {index + 1}</p>
                <h3 className="mt-2 text-xl font-semibold text-primary-900">{module.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{module.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card id="faq" className="border-primary/10 bg-white/80">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Câu hỏi thường gặp</CardTitle>
            <CardDescription>Liên hệ đội ngũ nếu bạn cần thêm thông tin.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Accordion type="single" collapsible className="space-y-2">
              {courseInfo.faq.map(item => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
      <section className="container">
        <Card className="border-primary/20 bg-primary/10">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-lg font-semibold text-primary">Sẵn sàng bắt đầu?</p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Để được nhận lộ trình cá nhân hoá, hãy đặt lịch tư vấn 15 phút cùng chuyên gia để chúng tôi hiểu rõ hơn về mục tiêu của bạn.
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <a href="mailto:hello@dinhduongtoiuu.com">Đặt lịch tư vấn</a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

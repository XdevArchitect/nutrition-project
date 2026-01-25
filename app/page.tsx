import type {Metadata} from "next";
import {HeroSection} from "@/components/hero";
import {FeatureGrid} from "@/components/feature-grid";
import {CoursePreview} from "@/components/course-preview";
import {Testimonials} from "@/components/testimonials";
import {TeamSection} from "@/components/team-section";
import {ContactForm} from "@/components/contact-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Tin tức dinh dưỡng, khoá học cá nhân hoá và cộng đồng đồng hành cùng bạn xây dựng lối sống lành mạnh."
};

export default function HomePage() {
  return (
    <div className="space-y-8 pb-16">
      <HeroSection />
      <FeatureGrid />
      <CoursePreview />
      <Testimonials />
      <TeamSection />
      <section className="container py-16">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-lg font-semibold text-primary">Sẵn sàng bắt đầu?</p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Để được nhận lộ trình cá nhân hoá, hãy đặt lịch tư vấn 15 phút cùng chuyên gia để chúng tôi hiểu rõ hơn về mục tiêu của bạn.
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <a href="#contact">Đặt lịch tư vấn</a>
            </Button>
          </CardContent>
        </Card>
      </section>
      <section id="contact" className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-primary-900">Liên hệ với chúng tôi</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Có câu hỏi hoặc muốn tìm hiểu thêm? Hãy gửi tin nhắn cho chúng tôi.
          </p>
        </div>
        <div className="mt-12">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
import Link from "next/link";
import {ArrowRight, Play} from "lucide-react";
import {heroHighlights} from "@/data/content";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="container grid gap-12 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:py-20">
      <div className="space-y-8">
        <Badge className="w-fit bg-primary/15 text-primary">Thay đổi sức khoẻ từ bên trong</Badge>
        <h1 className="text-4xl font-semibold leading-tight text-primary-900 sm:text-5xl">
          Kiến thức dinh dưỡng khoa học và khoá học cá nhân hoá cho người Việt bận rộn
        </h1>
        <p className="max-w-xl text-base text-muted-foreground">
          Khám phá hệ thống bài viết chuyên sâu, bài giảng sinh động và lộ trình coaching giúp bạn xây dựng chế độ ăn bền vững, không cần kiêng khem cực đoan.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/courses">
              Đăng ký khoá học <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/knowledge">
              <Play className="h-4 w-4" /> Xem kiến thức miễn phí
            </Link>
          </Button>
        </div>
        <dl className="grid gap-6 sm:grid-cols-3">
          {heroHighlights.map(item => (
            <div key={item.title} className="rounded-3xl border border-primary/15 bg-white/80 p-6 shadow-soft-xl">
              <dt className="text-base font-semibold text-primary">{item.title}</dt>
              <dd className="mt-3 text-sm text-muted-foreground">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-8 shadow-soft-xl">
        <div className="mx-auto flex h-full max-w-xs flex-col justify-between gap-6 text-sm text-neutral-700">
          <div className="rounded-3xl bg-white/80 p-5 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Chỉ số tuần này</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between">
                <span>Năng lượng nạp</span>
                <strong>1.650 kcal</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Protein</span>
                <strong>102 g</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Giấc ngủ trung bình</span>
                <strong>7.4 h</strong>
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white/70 p-5 shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Thực đơn mẫu</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium">Bữa sáng</p>
              <p className="text-muted-foreground">Yến mạch qua đêm, sữa hạt, hạt chia, trái cây berry</p>
              <p className="font-medium">Bữa trưa</p>
              <p className="text-muted-foreground">Cơm gạo lứt, cá hồi áp chảo, salad rau xanh</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
      </div>
    </section>
  );
}

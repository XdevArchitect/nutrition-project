import Link from "next/link";
import {ArrowRight, CheckCircle2} from "lucide-react";
import {courseInfo} from "@/data/content";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export function CoursePreview() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <Badge className="bg-secondary/20 text-secondary-foreground">Khoá học nổi bật</Badge>
        <h2 className="mt-6 text-3xl font-semibold text-primary-900 sm:text-4xl">{courseInfo.name}</h2>
        <p className="mt-3 text-base text-muted-foreground">{courseInfo.description}</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="border-primary/15 bg-white/90">
          <CardHeader>
            <CardTitle>Lộ trình 3 pha</CardTitle>
            <CardDescription>
              Từ đánh giá hiện trạng tới xây dựng kế hoạch dài hạn, mỗi tuần bạn đều có nhiệm vụ rõ ràng và bảng đánh giá tiến độ.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="space-y-5">
              {courseInfo.modules.map((module, index) => (
                <li key={module.title} className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{index + 1}</span>
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-primary">{module.title}</p>
                      <p className="text-sm text-muted-foreground">{module.content}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          {courseInfo.pricing.map(plan => (
            <Card key={plan.title} className={`border ${plan.highlight ? "border-primary bg-white" : "border-primary/10 bg-white/70"}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-primary">{plan.title}</CardTitle>
                  <p className="text-lg font-semibold text-primary">{plan.price}</p>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {plan.items.map(item => (
                  <p key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                  </p>
                ))}
                <Button asChild className="mt-4 w-full" variant={plan.highlight ? "default" : "secondary"}>
                  <Link href="/contact">Đăng ký tư vấn</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        {courseInfo.bonuses.map(bonus => (
          <span key={bonus} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 font-medium text-primary">
            <CheckCircle2 className="h-4 w-4" /> {bonus}
          </span>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/courses">
            Xem chi tiết lộ trình <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

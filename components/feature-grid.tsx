import {Sparkles} from "lucide-react";
import {featurePillars} from "@/data/content";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";

export function FeatureGrid() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" /> Giá trị cốt lõi
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-primary-900 sm:text-4xl">Chúng tôi đồng hành để bạn thay đổi bền vững</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Kết hợp dinh dưỡng, lối sống và mindset để giúp bạn xây dựng thói quen lâu dài thay vì những chế độ ăn kiêng ngắn hạn.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {featurePillars.map(pillar => (
          <Card key={pillar.title} className="border-primary/10 bg-white/80">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{pillar.title}</CardTitle>
              <CardDescription>{pillar.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              <ul className="space-y-2 text-left">
                <li>• Phân tích dữ liệu sức khoẻ</li>
                <li>• Gợi ý phù hợp khẩu vị Việt</li>
                <li>• Theo dõi tiến trình linh hoạt</li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

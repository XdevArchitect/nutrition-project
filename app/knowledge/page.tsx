import type {Metadata} from "next";
import Link from "next/link";
import {articles, knowledgeCategories} from "@/data/content";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ScrollArea} from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "Kiến thức",
  description: "Tổng hợp bài viết dinh dưỡng được cập nhật liên tục bởi đội ngũ chuyên gia."
};

const grouped: Record<string, (typeof articles)[number][]> = {};
for (const category of knowledgeCategories) {
  if (category.value === "all") continue;
  grouped[category.label] = articles.filter(article => article.category === category.label);
}

export default function KnowledgePage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="container space-y-6 pt-10">
        <Badge className="bg-primary/10 text-primary">Thư viện</Badge>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold text-primary-900">Kiến thức dinh dưỡng toàn diện</h1>
          <p className="text-base text-muted-foreground">
            Lựa chọn từ những chủ đề nền tảng đến chuyên sâu, phù hợp cho người mới bắt đầu lẫn huấn luyện viên, chuyên gia.
          </p>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4">
            {knowledgeCategories.map(category => (
              <span key={category.value} className="inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                {category.label}
              </span>
            ))}
          </div>
        </ScrollArea>
      </section>
      <section className="container space-y-12">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-primary">{category}</h2>
              <p className="text-sm text-muted-foreground">{items.length} bài viết được biên soạn theo chủ đề này.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {items.map(item => (
                <Card key={item.slug} className="border-primary/10 bg-white/75">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                    <CardDescription>{item.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 pt-0 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-primary">
                      <span>{item.level}</span>
                      <span>{item.readingTime}</span>
                    </div>
                    <Link href={`/knowledge/${item.slug}`} className="text-sm font-semibold text-primary">
                      Đọc bài viết →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

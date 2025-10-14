import Link from "next/link";
import {ArrowRight, Clock4} from "lucide-react";
import {articles} from "@/data/content";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";

export function ArticleGrid() {
  const featured = articles.slice(0, 3);
  return (
    <section className="container py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-primary-900 sm:text-4xl">Thư viện kiến thức dinh dưỡng</h2>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Bài viết được biên soạn bởi đội ngũ chuyên gia, có kiểm chứng và dễ áp dụng trong bối cảnh ăn uống của người Việt.
          </p>
        </div>
        <Link href="/knowledge" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {featured.map(article => (
          <Card key={article.slug} className="border-primary/10 bg-white/85">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {article.category}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock4 className="h-3.5 w-3.5" /> {article.readingTime}
                </span>
              </div>
              <CardTitle className="text-lg text-primary">{article.title}</CardTitle>
              <CardDescription>{article.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href={`/knowledge/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Đọc tiếp <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

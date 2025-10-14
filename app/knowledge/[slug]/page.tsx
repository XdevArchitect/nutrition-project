import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {articles} from "@/data/content";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

type Props = {params: {slug: string}};

export function generateStaticParams() {
  return articles.map(article => ({slug: article.slug}));
}

export function generateMetadata({params}: Props): Metadata {
  const article = articles.find(item => item.slug === params.slug);
  if (!article) return {title: "Không tìm thấy bài viết"};
  return {
    title: article.title,
    description: article.excerpt
  };
}

export default function ArticleDetailPage({params}: Props) {
  const article = articles.find(item => item.slug === params.slug);
  if (!article) notFound();

  return (
    <article className="container max-w-3xl space-y-10 py-12">
      <div className="space-y-4">
        <Badge variant="outline" className="border-primary/40 text-primary">
          {article.category}
        </Badge>
        <h1 className="text-4xl font-semibold text-primary-900">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium uppercase tracking-wide text-primary">{article.level}</span>
          <span>{article.readingTime}</span>
        </div>
      </div>
      <div className="prose prose-green max-w-none">
        {article.content.trim().split("\n\n").map((block, index) => {
          const trimmed = block.trim();
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={index} className="text-xl font-semibold text-primary">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }
          if (trimmed.startsWith("- ")) {
            const items = trimmed.split("\n").map(item => item.replace(/^-\s*/, "").trim());
            return (
              <ul key={index} className="list-disc space-y-2 pl-6">
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          if (/^\d+\./.test(trimmed)) {
            const items = trimmed.split("\n").map(item => item.replace(/^\d+\.\s*/, "").trim());
            return (
              <ol key={index} className="list-decimal space-y-2 pl-6">
                {items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          }
          return <p key={index}>{trimmed}</p>;
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/10 p-6">
        <div>
          <p className="text-lg font-semibold text-primary">Sẵn sàng đào sâu hơn?</p>
          <p className="text-sm text-muted-foreground">Tham gia khoá học 6 tuần để nhận lộ trình cá nhân hoá từ chuyên gia.</p>
        </div>
        <Button asChild>
          <Link href="/courses">Khám phá khoá học</Link>
        </Button>
      </div>
    </article>
  );
}

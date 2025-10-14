import type {Metadata} from "next";
import {HeroSection} from "@/components/hero";
import {FeatureGrid} from "@/components/feature-grid";
import {ArticleGrid} from "@/components/article-grid";
import {CoursePreview} from "@/components/course-preview";
import {Testimonials} from "@/components/testimonials";

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
      <ArticleGrid />
    </div>
  );
}

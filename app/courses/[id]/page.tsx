import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { VideoPlayer } from "@/components/video-player";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

interface CoursePageProps {
  params: {
    id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession();
  
  // Fetch course with videos
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      videos: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
  
  if (!course) {
    notFound();
  }
  
  // Check if user is enrolled (simplified check)
  const isEnrolled = session?.user?.role === "ADMIN" || session?.user?.role === "STUDENT";
  
  return (
    <div className="container py-8 pb-16">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/courses">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại khóa học
        </Link>
      </Button>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <Badge className="w-fit bg-primary/15 text-primary">
            {course.status === "PUBLISHED" ? "Đang mở" : "Nháp"}
          </Badge>
          <h1 className="text-3xl font-semibold text-primary-900 md:text-4xl">
            {course.title}
          </h1>
          <p className="text-base text-muted-foreground">
            {course.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Ngày tạo: {new Date(course.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{course.videos.length} video bài giảng</span>
            </div>
          </div>
        </div>
        
        {!isEnrolled ? (
          <Card className="border-primary/15 bg-white/80">
            <CardContent className="py-10 text-center">
              <h3 className="text-lg font-semibold text-primary">Khóa học này yêu cầu đăng ký</h3>
              <p className="mt-2 text-muted-foreground">
                Vui lòng đăng nhập và đăng ký khóa học để xem nội dung.
              </p>
              <Button asChild className="mt-4">
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-primary">Video bài giảng</h2>
            
            {course.videos.length === 0 ? (
              <Card className="border-primary/15 bg-white/80">
                <CardContent className="py-10 text-center">
                  <h3 className="text-lg font-semibold text-primary">Chưa có video</h3>
                  <p className="mt-2 text-muted-foreground">
                    Khóa học này chưa có video bài giảng. Vui lòng quay lại sau.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {course.videos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    videoId={video.id}
                    title={video.title}
                    description={video.description}
                    url={video.url}
                    courseId={course.id}
                    isPublished={video.isPublished}
                    maxViews={video.maxViews}
                    currentViews={0} // This would be fetched from DB in a real implementation
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
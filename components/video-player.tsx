"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Play, Lock } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  description?: string | null;
  url: string;
  courseId: string;
  isPublished: boolean;
  maxViews: number;
  currentViews: number;
  onVideoView?: () => void;
}

export function VideoPlayer({
  videoId,
  title,
  description,
  url,
  courseId,
  isPublished,
  maxViews,
  currentViews,
  onVideoView
}: VideoPlayerProps) {
  const { data: session, status } = useSession();
  const [canView, setCanView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(currentViews);

  // Check if user can view the video
  useEffect(() => {
    const checkViewPermission = async () => {
      if (status === "loading") return;
      
      if (!session) {
        setError("Bạn cần đăng nhập để xem video này.");
        setIsLoading(false);
        return;
      }

      if (session.user.role === "ADMIN") {
        setCanView(true);
        setIsLoading(false);
        return;
      }

      try {
        // Call API to check view permission
        const response = await fetch(`/api/video/check-view/${videoId}`);
        const result = await response.json();
        
        if (response.ok && result.canView) {
          setCanView(true);
          setViewCount(result.viewCount);
        } else {
          setError(result.message || "Bạn không có quyền xem video này.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi kiểm tra quyền xem video.");
      } finally {
        setIsLoading(false);
      }
    };

    checkViewPermission();
  }, [session, status, videoId]);

  const handleViewVideo = async () => {
    if (!canView) return;
    
    try {
      // Track video view
      const response = await fetch("/api/video/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          courseId,
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update view count
        setViewCount(result.viewCount);
        
        // Notify parent component
        if (onVideoView) {
          onVideoView();
        }
      } else {
        setError(result.message || "Không thể xem video.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi xem video.");
    }
  };

  // Check if URL is a local uploaded file
  const isLocalVideo = (url: string) => {
    return url.startsWith("/uploads/videos/") || url.includes("/uploads/videos/");
  };

  // Get video source based on URL type
  const getVideoSource = (url: string) => {
    if (isLocalVideo(url)) {
      // It's a local uploaded video
      return url;
    } else {
      // It's a YouTube URL, extract embed URL
      const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const youtubeId = getYoutubeId(url);
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-primary/15 bg-white/80">
        <CardHeader>
          <CardTitle>Đang tải video...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 animate-pulse rounded-lg bg-primary/10" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-primary/15 bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Lỗi khi xem video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!canView) {
    return (
      <Card className="border-primary/15 bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Video bị hạn chế
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Truy cập bị hạn chế</AlertTitle>
            <AlertDescription>
              Bạn không có quyền xem video này. Vui lòng liên hệ quản trị viên để biết thêm thông tin.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const videoSrc = getVideoSource(url);

  return (
    <Card className="border-primary/15 bg-white/80">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-2">{description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {viewCount} / {maxViews} lượt xem
            </div>
            <Button onClick={handleViewVideo} disabled={viewCount >= maxViews}>
              <Play className="mr-2 h-4 w-4" />
              {viewCount >= maxViews ? "Đã đạt giới hạn" : "Xem video"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewCount < maxViews ? (
          isLocalVideo(url) ? (
            // Render HTML5 video player for local videos
            <div className="aspect-video w-full">
              <video 
                controls 
                className="h-full w-full rounded-lg"
                poster="/images/video-poster.png"
              >
                <source src={videoSrc} type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          ) : (
            // Render iframe for YouTube videos
            <div className="aspect-video w-full">
              <iframe
                src={videoSrc}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-lg"
              />
            </div>
          )
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-primary/10">
            <div className="text-center">
              <Lock className="mx-auto h-12 w-12 text-primary/50" />
              <p className="mt-4 text-lg font-medium text-primary">
                Đã đạt giới hạn {maxViews} lần xem
              </p>
              <p className="mt-2 text-muted-foreground">
                Bạn đã xem video này {viewCount} lần. Liên hệ hỗ trợ để biết thêm thông tin.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
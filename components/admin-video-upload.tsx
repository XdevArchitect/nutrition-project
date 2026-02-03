"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileVideo, CheckCircle, AlertCircle } from "lucide-react";

interface VideoUploadProps {
  courseId: string;
  onVideoCreated?: (video: any) => void;
  onCancel?: () => void;
}

export function AdminVideoUpload({ courseId, onVideoCreated, onCancel }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov", "video/mkv"];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Chỉ hỗ trợ các định dạng video: MP4, WebM, OGG, AVI, MOV, MKV");
        return;
      }

      // Validate file size (max 1GB)
      if (selectedFile.size > 1024 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 1GB");
        return;
      }

      setFile(selectedFile);
      setError(null);
      
      // Auto-fill title from filename
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
  };

  const handleUpload = async () => {
    // Validate required fields
    if (!file) {
      setError("Vui lòng chọn file video");
      return;
    }
    
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề video");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload file to server
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/admin/videos/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(uploadResult.error || "Không thể tải lên file");
      }

      // Create video record with uploaded file path
      const videoResponse = await fetch("/api/admin/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          title,
          description,
          url: uploadResult.path, // Use uploaded file path instead of YouTube URL
          duration: duration ? parseInt(duration) : undefined,
          sortOrder: sortOrder ? parseInt(sortOrder) : undefined,
        }),
      });

      const videoResult = await videoResponse.json();

      if (!videoResponse.ok) {
        throw new Error(videoResult.error || "Không thể tạo video");
      }

      setUploadSuccess(true);
      
      // Notify parent component
      if (onVideoCreated) {
        onVideoCreated(videoResult.video);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải lên");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Helper component for required field indicator
  const RequiredIndicator = () => (
    <span className="text-red-500">*</span>
  );

  return (
    <Card className="border-primary/15 bg-white/90">
      <CardHeader>
        <CardTitle className="text-lg text-primary">Thêm video mới</CardTitle>
        <CardDescription>Tải lên video từ máy tính của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess ? (
          <div className="rounded-lg border border-green-500 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Video đã được tải lên thành công!</span>
            </div>
          </div>
        ) : (
          <>
            {/* File selection - REQUIRED */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                Chọn file video <RequiredIndicator />
              </label>
              <div 
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30 p-6 transition-colors hover:border-primary/50"
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <Upload className="h-8 w-8 text-primary/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {file ? file.name : "Nhấp để chọn file hoặc kéo thả vào đây"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ MP4, WebM, OGG, AVI, MOV, MKV (tối đa 1GB)
                </p>
              </div>
              
              {file && (
                <div className="flex items-center gap-2 text-sm">
                  <FileVideo className="h-4 w-4 text-primary" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            {/* Video details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Tiêu đề <RequiredIndicator />
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề video"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Thứ tự
                </label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  placeholder="Thứ tự hiển thị"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả video (tuỳ chọn)"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Thời lượng (phút)
                </label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Thời lượng video"
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Legend for required fields */}
            <div className="text-xs text-muted-foreground">
              <RequiredIndicator /> Trường bắt buộc
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <span>Đang tải lên... {uploadProgress}%</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Tải lên video
                  </span>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={onCancel}
                disabled={isUploading}
              >
                Huỷ
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
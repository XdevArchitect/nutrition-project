"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Badge} from "@/components/ui/badge";
import {AdminVideoUpload} from "@/components/admin-video-upload"; // Import component upload mới

type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

type EnrollmentSummary = {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type VideoSummary = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  duration: number | null;
  sortOrder: number;
  isPublished: boolean;
  courseId: string;
};

type CourseSummary = {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  videos: VideoSummary[];
  enrollments: EnrollmentSummary[];
};

const COURSE_STATUSES: {value: CourseStatus; label: string}[] = [
  {value: "DRAFT", label: "Nháp"},
  {value: "PUBLISHED", label: "Đang mở"},
  {value: "ARCHIVED", label: "Đã lưu trữ"}
];

type CourseDraft = {
  title: string;
  description: string;
  status: CourseStatus;
};

type VideoDraft = {
  title: string;
  description: string;
  url: string;
  duration: string;
  sortOrder: string;
  isPublished: boolean;
};

type VideoFormDraft = {
  title: string;
  // url: string, // Remove URL field
  description: string;
  duration: string;
  sortOrder: string;
};

// Helper component for required field indicator
const RequiredIndicator = () => (
  <span className="text-red-500">*</span>
);

export function AdminCourseManager() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [courseForm, setCourseForm] = useState<CourseDraft>({
    title: "",
    description: "",
    status: "DRAFT"
  });

  const [courseDrafts, setCourseDrafts] = useState<Record<string, CourseDraft>>({});
  const [videoDrafts, setVideoDrafts] = useState<Record<string, VideoDraft>>({});
  const [newVideoForms, setNewVideoForms] = useState<Record<string, VideoFormDraft>>({});
  
  // State để quản lý hiển thị form upload video
  const [showUploadForm, setShowUploadForm] = useState<Record<string, boolean>>({});

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/courses", {cache: "no-store"});
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể tải khoá học");
      }
      const data = (await response.json()) as {courses: CourseSummary[]};
      setCourses(data.courses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải khoá học");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses().catch(() => undefined);
  }, [fetchCourses]);

  useEffect(() => {
    const nextCourseDrafts: Record<string, CourseDraft> = {};
    const nextVideoDrafts: Record<string, VideoDraft> = {};
    courses.forEach(course => {
      nextCourseDrafts[course.id] = {
        title: course.title,
        description: course.description,
        status: course.status
      };
      course.videos.forEach(video => {
        nextVideoDrafts[video.id] = {
          title: video.title,
          description: video.description ?? "",
          url: video.url,
          duration: video.duration ? String(video.duration) : "",
          sortOrder: String(video.sortOrder ?? 0),
          isPublished: video.isPublished
        };
      });
    });
    setCourseDrafts(nextCourseDrafts);
    setVideoDrafts(nextVideoDrafts);
    setNewVideoForms(current => {
      const next: Record<string, VideoFormDraft> = {...current};
      courses.forEach(course => {
        if (!next[course.id]) {
          next[course.id] = {title: "", description: "", duration: "", sortOrder: String(course.videos.length + 1)};
        }
      });
      return next;
    });
  }, [courses]);

  const courseCount = useMemo(() => courses.length, [courses]);

  const handleCreateCourse = async (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(courseForm)
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể tạo khoá học");
      }
      setCourseForm({title: "", description: "", status: "DRAFT"});
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo khoá học");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCourse = async (courseId: string) {
    const draft = courseDrafts[courseId];
    if (!draft) return;
    setSavingId(courseId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(draft)
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể cập nhật khoá học");
      }
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật khoá học");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) {
    if (!window.confirm("Bạn chắc chắn muốn xoá khoá học này?")) return;
    setSavingId(courseId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {method: "DELETE"});
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể xoá khoá học");
      }
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xoá khoá học");
    } finally {
      setSavingId(null);
    }
  };

  const handleVideoChange = (videoId: string, field: keyof VideoDraft, value: string | boolean) => {
    setVideoDrafts(current => ({
      ...current,
      [videoId]: {
        ...current[videoId],
        [field]: value
      }
    }));
  };

  const handleSaveVideo = async (videoId: string) {
    const draft = videoDrafts[videoId];
    if (!draft) return;
    setSavingId(videoId);
    setError(null);
    try {
      const payload = {
        title: draft.title,
        description: draft.description,
        url: draft.url,
        duration: draft.duration ? Number(draft.duration) : undefined,
        sortOrder: draft.sortOrder ? Number(draft.sortOrder) : undefined,
        isPublished: draft.isPublished
      };
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const payloadResponse = await response.json().catch(() => ({}));
        throw new Error((payloadResponse as {error?: string}).error ?? "Không thể cập nhật video");
      }
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật video");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteVideo = async (videoId: string) {
    if (!window.confirm("Bạn chắc chắn muốn xoá video này?")) return;
    setSavingId(videoId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {method: "DELETE"});
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể xoá video");
      }
      await fetchCourses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xoá video");
    } finally {
      setSavingId(null);
    }
  };

  const handleNewVideoChange = (courseId: string, field: keyof VideoFormDraft, value: string) => {
    setNewVideoForms(current => ({
      ...current,
      [courseId]: {
        ...current[courseId],
        [field]: value
      }
    }));
  };

  // Xử lý khi video được tạo thành công từ component upload
  const handleVideoCreated = async (video: any) => {
    // Reset form upload và ẩn form
    setShowUploadForm({});
    // Refresh danh sách khóa học để hiển thị video mới
    await fetchCourses();
  };

  // Toggle hiển thị form upload
  const toggleUploadForm = (courseId: string) => {
    setShowUploadForm(current => ({
      ...current,
      [courseId]: !current[courseId]
    }));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Quản lý khoá học</h2>
          <p className="text-sm text-muted-foreground">Tạo, chỉnh sửa và sắp xếp video cho mỗi khoá.</p>
        </div>
        <Badge className="bg-primary/10 text-primary">{courseCount} khoá học</Badge>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Card className="border-primary/15 bg-white/85">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Tạo khoá học mới</CardTitle>
          <CardDescription>Nhập thông tin cơ bản để bắt đầu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCourse} className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Tiêu đề <RequiredIndicator />
              </span>
              <Input
                value={courseForm.title}
                onChange={event => setCourseForm(current => ({...current, title: event.target.value}))}
                placeholder="Khoá học dinh dưỡng 101"
                required
              />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Trạng thái</span>
              <select
                className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                value={courseForm.status}
                onChange={event => setCourseForm(current => ({...current, status: event.target.value as CourseStatus}))}
              >
                {COURSE_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                Mô tả <RequiredIndicator />
              </span>
              <Textarea
                value={courseForm.description}
                onChange={event => setCourseForm(current => ({...current, description: event.target.value}))}
                placeholder="Giới thiệu tổng quan về khoá học"
                rows={3}
                required
              />
            </label>
            <div className="md:col-span-3">
              <Button type="submit" disabled={creating}>
                {creating ? "Đang tạo..." : "Tạo khoá học"}
              </Button>
            </div>
          </form>
          
          {/* Legend for required fields */}
          <div className="mt-4 text-xs text-muted-foreground">
            <RequiredIndicator /> Trường bắt buộc
          </div>
        </CardContent>
      </Card>
      {loading ? (
        <Card className="border-primary/10 bg-white/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Đang tải danh sách khoá học...</CardContent>
        </Card>
      ) : courses.length === 0 ? (
        <Card className="border-primary/10 bg-white/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Chưa có khoá học nào.</CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {courses.map(course => {
            const draft = courseDrafts[course.id];
            return (
              <Card key={course.id} className="border-primary/10 bg-white/85">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {draft ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="space-y-2 md:col-span-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                          Tiêu đề <RequiredIndicator />
                        </span>
                        <Input
                          value={draft.title}
                          onChange={event =>
                            setCourseDrafts(current => ({
                              ...current,
                              [course.id]: {...current[course.id], title: event.target.value}
                            }))
                          }
                        />
                      </label>
                      <label className="space-y-2 md:col-span-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Trạng thái</span>
                        <select
                          className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                          value={draft.status}
                          onChange={event =>
                            setCourseDrafts(current => ({
                              ...current,
                              [course.id]: {...current[course.id], status: event.target.value as CourseStatus}
                            }))
                          }
                        >
                          {COURSE_STATUSES.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 md:col-span-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                          Mô tả <RequiredIndicator />
                        </span>
                        <Textarea
                          value={draft.description}
                          onChange={event =>
                            setCourseDrafts(current => ({
                              ...current,
                              [course.id]: {...current[course.id], description: event.target.value}
                            }))
                          }
                          rows={3}
                        />
                      </label>
                      <div className="flex flex-wrap gap-3 md:col-span-3">
                        <Button onClick={() => handleUpdateCourse(course.id)} disabled={savingId === course.id}>
                          {savingId === course.id ? "Đang lưu..." : "Lưu khoá học"}
                        </Button>
                        <Button variant="ghost" onClick={() => handleDeleteCourse(course.id)} disabled={savingId === course.id}>
                          {savingId === course.id ? "Đang xoá..." : "Xoá khoá học"}
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-primary">Video trong khoá ({course.videos.length})</h3>
                    {course.videos.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Chưa có video nào.</p>
                    ) : (
                      <div className="space-y-4">
                        {course.videos.map(video => {
                          const videoDraft = videoDrafts[video.id];
                          return (
                            <Card key={video.id} className="border-primary/10 bg-white/90">
                              <CardContent className="grid gap-4 md:grid-cols-4">
                                {videoDraft ? (
                                  <>
                                    <label className="space-y-2 md:col-span-2">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                                        Tiêu đề <RequiredIndicator />
                                      </span>
                                      <Input
                                        value={videoDraft.title}
                                        onChange={event => handleVideoChange(video.id, "title", event.target.value)}
                                      />
                                    </label>
                                    <label className="space-y-2 md:col-span-2">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Đường dẫn</span>
                                      <Input
                                        value={videoDraft.url}
                                        readOnly
                                        className="bg-gray-100"
                                      />
                                    </label>
                                    <label className="space-y-2 md:col-span-4">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Mô tả</span>
                                      <Textarea
                                        value={videoDraft.description}
                                        onChange={event => handleVideoChange(video.id, "description", event.target.value)}
                                        rows={2}
                                      />
                                    </label>
                                    <div className="space-y-2">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Thứ tự</span>
                                      <Input
                                        type="number"
                                        value={videoDraft.sortOrder}
                                        onChange={event => handleVideoChange(video.id, "sortOrder", event.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Thời lượng (phút)</span>
                                      <Input
                                        type="number"
                                        value={videoDraft.duration}
                                        onChange={event => handleVideoChange(video.id, "duration", event.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Trạng thái</span>
                                      <select
                                        className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                                        value={videoDraft.isPublished ? "true" : "false"}
                                        onChange={event => handleVideoChange(video.id, "isPublished", event.target.value === "true")}
                                      >
                                        <option value="true">Hiển thị</option>
                                        <option value="false">Ẩn</option>
                                      </select>
                                    </div>
                                    <div className="flex items-end gap-3 md:col-span-4">
                                      <Button onClick={() => handleSaveVideo(video.id)} disabled={savingId === videoId}>
                                        {savingId === videoId ? "Đang lưu..." : "Lưu video"}
                                      </Button>
                                      <Button variant="ghost" onClick={() => handleDeleteVideo(video.id)} disabled={savingId === videoId}>
                                        {savingId === videoId ? "Đang xoá..." : "Xoá video"}
                                      </Button>
                                    </div>
                                  </>
                                ) : null}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-primary">Thêm video mới</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleUploadForm(course.id)}
                      >
                        {showUploadForm[course.id] ? "Huỷ" : "Tải video lên"}
                      </Button>
                    </div>
                    
                    {showUploadForm[course.id] ? (
                      <AdminVideoUpload 
                        courseId={course.id}
                        onVideoCreated={handleVideoCreated}
                        onCancel={() => toggleUploadForm(course.id)}
                      />
                    ) : (
                      <div className="grid gap-3 md:grid-cols-4">
                        <Input
                          placeholder="Tiêu đề"
                          value={newVideoForms[course.id]?.title ?? ""}
                          onChange={event => handleNewVideoChange(course.id, "title", event.target.value)}
                          className="md:col-span-2"
                        />
                        <Textarea
                          placeholder="Mô tả"
                          value={newVideoForms[course.id]?.description ?? ""}
                          onChange={event => handleNewVideoChange(course.id, "description", event.target.value)}
                          className="md:col-span-4"
                          rows={2}
                        />
                        <Input
                          type="number"
                          placeholder="Thời lượng (phút)"
                          value={newVideoForms[course.id]?.duration ?? ""}
                          onChange={event => handleNewVideoChange(course.id, "duration", event.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Thứ tự"
                          value={newVideoForms[course.id]?.sortOrder ?? ""}
                          onChange={event => handleNewVideoChange(course.id, "sortOrder", event.target.value)}
                        />
                        <div className="md:col-span-4">
                          <Button 
                            variant="outline" 
                            disabled
                            className="opacity-50 cursor-not-allowed"
                          >
                            Thêm video (chức năng này đã được thay thế bằng upload file)
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">Học viên ({course.enrollments.length})</p>
                    {course.enrollments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Chưa có học viên ghi danh.</p>
                    ) : (
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {course.enrollments.map(enrollment => (
                          <li key={enrollment.id}>
                            {enrollment.user.name} <span className="text-xs text-neutral-400">({enrollment.user.email})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
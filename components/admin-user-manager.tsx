"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";

type UserRole = "STUDENT" | "MENTOR" | "ADMIN";

type CourseOption = {
  id: string;
  title: string;
};

type EnrollmentDetail = {
  id: string;
  course: CourseOption;
};

type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  enrollments: EnrollmentDetail[];
};

type UserDraft = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
};

const ROLE_OPTIONS: {value: UserRole; label: string}[] = [
  {value: "STUDENT", label: "Học viên"},
  {value: "MENTOR", label: "Mentor"},
  {value: "ADMIN", label: "Quản trị"}
];

export function AdminUserManager() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);

  const [userForm, setUserForm] = useState<UserDraft>({
    name: "",
    email: "",
    phone: "",
    role: "STUDENT"
  });

  const [userDrafts, setUserDrafts] = useState<Record<string, UserDraft>>({});
  const [enrollmentDrafts, setEnrollmentDrafts] = useState<Record<string, string>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        fetch("/api/admin/users", {cache: "no-store"}),
        fetch("/api/admin/courses", {cache: "no-store"})
      ]);

      if (!usersResponse.ok) {
        const payload = await usersResponse.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể tải người dùng");
      }
      if (!coursesResponse.ok) {
        const payload = await coursesResponse.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể tải khoá học");
      }

      const usersData = (await usersResponse.json()) as {users: UserDetail[]};
      const coursesData = (await coursesResponse.json()) as {courses: CourseOption[]};

      setUsers(usersData.users);
      setCourses(coursesData.courses.map(course => ({id: course.id, title: course.title})));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu quản lý");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData().catch(() => undefined);
  }, [fetchData]);

  useEffect(() => {
    const drafts: Record<string, UserDraft> = {};
    const enrollDrafts: Record<string, string> = {};
    users.forEach(user => {
      drafts[user.id] = {
        name: user.name,
        email: user.email,
        phone: user.phone ?? "",
        role: user.role
      };
      enrollDrafts[user.id] = "";
    });
    setUserDrafts(drafts);
    setEnrollmentDrafts(enrollDrafts);
  }, [users]);

  const userCount = useMemo(() => users.length, [users]);

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userForm)
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể tạo người dùng");
      }
      setUserForm({name: "", email: "", phone: "", role: "STUDENT"});
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo người dùng");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (userId: string) => {
    const draft = userDrafts[userId];
    if (!draft) return;
    setSavingId(userId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          phone: draft.phone,
          role: draft.role
        })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể cập nhật người dùng");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật người dùng");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá người dùng này?")) return;
    setSavingId(userId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {method: "DELETE"});
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể xoá người dùng");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xoá người dùng");
    } finally {
      setSavingId(null);
    }
  };

  const handleEnroll = async (userId: string) => {
    const courseId = enrollmentDrafts[userId];
    if (!courseId) {
      setError("Chọn khoá học để ghi danh");
      return;
    }
    setEnrollmentId(userId);
    setError(null);
    try {
      const response = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({userId, courseId})
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể ghi danh");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể ghi danh");
    } finally {
      setEnrollmentId(null);
    }
  };

  const handleRemoveEnrollment = async (enrollmentIdValue: string) => {
    if (!window.confirm("Huỷ ghi danh này?")) return;
    setEnrollmentId(enrollmentIdValue);
    setError(null);
    try {
      const response = await fetch(`/api/admin/enrollments/${enrollmentIdValue}`, {method: "DELETE"});
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error((payload as {error?: string}).error ?? "Không thể huỷ ghi danh");
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể huỷ ghi danh");
    } finally {
      setEnrollmentId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-primary">Quản lý người dùng</h2>
          <p className="text-sm text-muted-foreground">Tạo tài khoản, phân quyền và quản lý ghi danh khoá học.</p>
        </div>
        <Badge className="bg-primary/10 text-primary">{userCount} người dùng</Badge>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Card className="border-primary/15 bg-white/85">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Thêm người dùng mới</CardTitle>
          <CardDescription>Nhập thông tin cơ bản và quyền truy cập.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-4">
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Họ tên</span>
              <Input
                value={userForm.name}
                onChange={event => setUserForm(current => ({...current, name: event.target.value}))}
                placeholder="Nguyễn Văn A"
                required
              />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Email</span>
              <Input
                type="email"
                value={userForm.email}
                onChange={event => setUserForm(current => ({...current, email: event.target.value}))}
                placeholder="ban@example.com"
                required
              />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Số điện thoại</span>
              <Input
                value={userForm.phone}
                onChange={event => setUserForm(current => ({...current, phone: event.target.value}))}
                placeholder="0989 123 456"
              />
            </label>
            <label className="space-y-2 md:col-span-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">Quyền hạn</span>
              <select
                className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                value={userForm.role}
                onChange={event => setUserForm(current => ({...current, role: event.target.value as UserRole}))}
              >
                {ROLE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="md:col-span-4">
              <Button type="submit" disabled={creating}>
                {creating ? "Đang tạo..." : "Tạo người dùng"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {loading ? (
        <Card className="border-primary/10 bg-white/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Đang tải danh sách người dùng...</CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="border-primary/10 bg-white/80">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">Chưa có người dùng nào.</CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {users.map(user => {
            const draft = userDrafts[user.id];
            return (
              <Card key={user.id} className="border-primary/10 bg-white/85">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {draft ? (
                    <div className="grid gap-4 md:grid-cols-4">
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Họ tên</span>
                        <Input
                          value={draft.name}
                          onChange={event =>
                            setUserDrafts(current => ({
                              ...current,
                              [user.id]: {...current[user.id], name: event.target.value}
                            }))
                          }
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Email</span>
                        <Input
                          type="email"
                          value={draft.email}
                          onChange={event =>
                            setUserDrafts(current => ({
                              ...current,
                              [user.id]: {...current[user.id], email: event.target.value}
                            }))
                          }
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Số điện thoại</span>
                        <Input
                          value={draft.phone}
                          onChange={event =>
                            setUserDrafts(current => ({
                              ...current,
                              [user.id]: {...current[user.id], phone: event.target.value}
                            }))
                          }
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-primary">Quyền hạn</span>
                        <select
                          className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
                          value={draft.role}
                          onChange={event =>
                            setUserDrafts(current => ({
                              ...current,
                              [user.id]: {...current[user.id], role: event.target.value as UserRole}
                            }))
                          }
                        >
                          {ROLE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="flex flex-wrap gap-3 md:col-span-4">
                        <Button onClick={() => handleUpdateUser(user.id)} disabled={savingId === user.id}>
                          {savingId === user.id ? "Đang lưu..." : "Lưu người dùng"}
                        </Button>
                        <Button variant="ghost" onClick={() => handleDeleteUser(user.id)} disabled={savingId === user.id}>
                          {savingId === user.id ? "Đang xoá..." : "Xoá người dùng"}
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-primary">Ghi danh khoá học</h3>
                    <div className="flex flex-wrap gap-3">
                      <select
                        className="flex h-11 w-full rounded-full border border-input bg-white px-4 text-sm text-neutral-700 outline-none transition focus-visible:ring-2 focus-visible:ring-primary md:w-64"
                        value={enrollmentDrafts[user.id] ?? ""}
                        onChange={event =>
                          setEnrollmentDrafts(current => ({
                            ...current,
                            [user.id]: event.target.value
                          }))
                        }
                      >
                        <option value="">Chọn khoá học</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                      <Button onClick={() => handleEnroll(user.id)} disabled={enrollmentId === user.id}>
                        {enrollmentId === user.id ? "Đang ghi danh..." : "Ghi danh"}
                      </Button>
                    </div>
                    {user.enrollments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Chưa có khoá học nào.</p>
                    ) : (
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {user.enrollments.map(enrollment => (
                          <li key={enrollment.id} className="flex items-center justify-between gap-3 rounded-full border border-primary/20 px-4 py-2">
                            <span>{enrollment.course.title}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveEnrollment(enrollment.id)}
                              disabled={enrollmentId === enrollment.id}
                            >
                              {enrollmentId === enrollment.id ? "Đang huỷ..." : "Huỷ"}
                            </Button>
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

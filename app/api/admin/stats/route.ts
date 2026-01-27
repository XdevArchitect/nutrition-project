import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    // Get total users
    const totalUsers = await prisma.user.count();

    // Get total courses
    const totalCourses = await prisma.course.count();

    // Get total videos
    const totalVideos = await prisma.video.count();

    // Get published courses
    const publishedCourses = await prisma.course.count({
      where: {
        status: "PUBLISHED"
      }
    });

    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get total enrollments
    const totalEnrollments = await prisma.courseEnrollment.count();

    // Get total video views
    const videoViews = await prisma.videoView.count();

    // Prepare statistics data
    const stats = {
      totalUsers,
      totalCourses,
      totalVideos,
      publishedCourses,
      recentUsers,
      totalEnrollments,
      videoViews
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Không thể tải thống kê dashboard" },
      { status: 500 }
    );
  }
}
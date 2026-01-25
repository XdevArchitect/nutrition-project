import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { trackVideoView, canViewVideo } from "@/lib/session-manager";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { videoId, courseId } = body;
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId" },
        { status: 400 }
      );
    }
    
    // Check if user can view the video
    const viewPermission = await canViewVideo(session.user.id, videoId);
    
    if (!viewPermission.canView) {
      return NextResponse.json(
        { 
          error: "View limit exceeded", 
          message: viewPermission.message,
          viewCount: viewPermission.viewCount,
          maxViews: viewPermission.maxViews
        },
        { status: 403 }
      );
    }
    
    // Find enrollment for this user and course
    let enrollment = null;
    if (courseId) {
      enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId: courseId,
          },
        },
      });
    }
    
    // Track video view
    const videoView = await trackVideoView(
      session.user.id, 
      videoId, 
      enrollment?.id
    );
    
    return NextResponse.json({
      success: true,
      viewCount: videoView.viewCount,
      message: `Video view tracked successfully. View count: ${videoView.viewCount}`
    });
  } catch (error) {
    console.error("Error tracking video view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
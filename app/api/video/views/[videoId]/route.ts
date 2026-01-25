import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real implementation, this would check the database for:
    // 1. Whether the user has access to this video (through course enrollment)
    // 2. How many times they've viewed it
    // 3. Whether they're still within the view limit
    
    // For this demo, we'll return mock data
    const mockViewData = {
      videoId: params.videoId,
      userId: session.user.id,
      viewCount: 3, // Mock view count
      maxViews: 10, // From our Prisma schema
      canView: true,
      message: null
    };
    
    return NextResponse.json(mockViewData);
  } catch (error) {
    console.error("Error checking video views:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Verify the user has access to this video
    // 2. Increment the view count in the database
    // 3. Check if they've exceeded their view limit
    // 4. Return updated view information
    
    // For this demo, we'll return mock data
    const mockUpdatedViewData = {
      videoId: params.videoId,
      userId: session.user.id,
      viewCount: 4, // Incremented from previous count
      maxViews: 10,
      canView: true,
      message: "View recorded successfully"
    };
    
    return NextResponse.json(mockUpdatedViewData);
  } catch (error) {
    console.error("Error recording video view:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
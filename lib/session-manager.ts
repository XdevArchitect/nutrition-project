import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

// Device session management constants
const MAX_DEVICES_PER_USER = 2;
const SESSION_DURATION_HOURS = 24 * 7; // 1 week

/**
 * Generate a unique device identifier
 */
export function generateDeviceId(): string {
  return nanoid(32);
}

/**
 * Get device identifier from cookies or generate new one
 */
export function getOrCreateDeviceId(): string {
  const cookieStore = cookies();
  let deviceId = cookieStore.get("device-id")?.value;
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    // In a real implementation, you would set this cookie in a Server Component
    // or through middleware
  }
  
  return deviceId;
}

/**
 * Create a new user session
 */
export async function createUserSession(userId: string, deviceId: string, ipAddress?: string, userAgent?: string) {
  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);
  
  // Create new session
  const session = await prisma.userSession.create({
    data: {
      userId,
      deviceId,
      ipAddress,
      userAgent,
      expiresAt,
    },
  });
  
  return session;
}

/**
 * Validate if user can create a new session (device limit)
 */
export async function validateSessionLimit(userId: string, deviceId: string): Promise<{ 
  canCreateSession: boolean; 
  activeSessions: number;
  message?: string 
}> {
  // Count active sessions for this user
  const activeSessions = await prisma.userSession.count({
    where: {
      userId,
      isActive: true,
      OR: [
        {
          expiresAt: {
            gt: new Date(),
          },
        },
        {
          deviceId: {
            not: deviceId,
          },
        },
      ],
    },
  });
  
  // Check if user has reached device limit
  if (activeSessions >= MAX_DEVICES_PER_USER) {
    return {
      canCreateSession: false,
      activeSessions,
      message: `Bạn chỉ có thể đăng nhập trên ${MAX_DEVICES_PER_USER} thiết bị cùng lúc.`,
    };
  }
  
  return {
    canCreateSession: true,
    activeSessions,
  };
}

/**
 * Invalidate expired sessions
 */
export async function cleanupExpiredSessions() {
  const now = new Date();
  
  await prisma.userSession.updateMany({
    where: {
      expiresAt: {
        lt: now,
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Get active sessions for a user
 */
export async function getUserActiveSessions(userId: string) {
  const now = new Date();
  
  const sessions = await prisma.userSession.findMany({
    where: {
      userId,
      isActive: true,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  return sessions;
}

/**
 * Revoke a specific session
 */
export async function revokeSession(sessionId: string) {
  await prisma.userSession.update({
    where: {
      id: sessionId,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Track video view for a user
 */
export async function trackVideoView(userId: string, videoId: string, enrollmentId?: string) {
  // Find existing view record
  let videoView = await prisma.videoView.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
  });
  
  // If no record exists, create one
  if (!videoView) {
    videoView = await prisma.videoView.create({
      data: {
        userId,
        videoId,
        enrollmentId,
        viewCount: 1,
      },
    });
  } else {
    // Increment view count
    videoView = await prisma.videoView.update({
      where: {
        id: videoView.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });
  }
  
  return videoView;
}

/**
 * Check if user can view a video (view count limit)
 */
export async function canViewVideo(userId: string, videoId: string): Promise<{
  canView: boolean;
  viewCount: number;
  maxViews: number;
  message?: string;
}> {
  // Get video details
  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
    select: {
      maxViews: true,
    },
  });
  
  if (!video) {
    return {
      canView: false,
      viewCount: 0,
      maxViews: 0,
      message: "Video không tồn tại.",
    };
  }
  
  // Get user's view count for this video
  const videoView = await prisma.videoView.findUnique({
    where: {
      userId_videoId: {
        userId,
        videoId,
      },
    },
    select: {
      viewCount: true,
    },
  });
  
  const currentViewCount = videoView?.viewCount || 0;
  
  // Check if user has exceeded view limit
  if (currentViewCount >= video.maxViews) {
    return {
      canView: false,
      viewCount: currentViewCount,
      maxViews: video.maxViews,
      message: `Bạn đã xem video này ${video.maxViews} lần. Không thể xem thêm.`,
    };
  }
  
  return {
    canView: true,
    viewCount: currentViewCount,
    maxViews: video.maxViews,
  };
}
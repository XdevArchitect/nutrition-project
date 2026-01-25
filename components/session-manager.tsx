"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react";

interface SessionData {
  id: string;
  deviceType: string;
  lastActive: Date;
  location?: string;
  current?: boolean;
}

export function SessionManager() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    if (session) {
      // Simulate fetching session data
      setTimeout(() => {
        setSessions([
          {
            id: "1",
            deviceType: "desktop",
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            location: "Hanoi, Vietnam",
            current: true
          },
          {
            id: "2",
            deviceType: "mobile",
            lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            location: "Da Nang, Vietnam"
          }
        ]);
        setLoading(false);
      }, 500);
    }
  }, [session]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const handleLogoutSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const handleRefreshSessions = () => {
    setLoading(true);
    // Simulate refreshing session data
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (!session) return null;

  return (
    <Card className="border-primary/15 bg-white/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Thiết bị đang đăng nhập</CardTitle>
            <CardDescription>
              Quản lý các thiết bị đang sử dụng tài khoản của bạn
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshSessions}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-pulse rounded-full bg-primary/10" />
                  <div className="space-y-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-primary/10" />
                    <div className="h-3 w-32 animate-pulse rounded bg-primary/10" />
                  </div>
                </div>
                <div className="h-8 w-20 animate-pulse rounded bg-primary/10" />
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground">Không có thiết bị nào đang đăng nhập</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((sessionData) => (
              <div 
                key={sessionData.id} 
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  sessionData.current ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {getDeviceIcon(sessionData.deviceType)}
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      {sessionData.deviceType === "mobile" ? "Điện thoại" : 
                       sessionData.deviceType === "tablet" ? "Máy tính bảng" : "Máy tính"}
                      {sessionData.current && (
                        <span className="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs text-white">
                          Hiện tại
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lần cuối: {format(new Date(sessionData.lastActive), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </p>
                    {sessionData.location && (
                      <p className="text-xs text-muted-foreground">
                        Vị trí: {sessionData.location}
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleLogoutSession(sessionData.id)}
                  disabled={sessionData.current}
                >
                  Đăng xuất
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Bạn đang sử dụng {sessions.length}/2 thiết bị được phép.</p>
        </div>
      </CardContent>
    </Card>
  );
}
import {AdminLogoutButton} from "@/components/admin-logout-button";
import {Badge} from "@/components/ui/badge";

type Props = {
  leadCount: number;
};

export function AdminToolbar({leadCount}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-primary">Bảng điều khiển</h1>
        <p className="text-sm text-muted-foreground">Theo dõi lead và yêu cầu tư vấn.</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-primary/10 text-primary">{leadCount} lead</Badge>
        <AdminLogoutButton />
      </div>
    </div>
  );
}

import type {Metadata} from "next";
import {teamMembers} from "@/data/content";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Đội ngũ chuyên gia dinh dưỡng, thể chất và health coach đồng hành cùng bạn."
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      <section className="container space-y-6 pt-10">
        <Badge className="bg-primary/10 text-primary">Về chúng tôi</Badge>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold text-primary-900">Đồng hành bởi đội ngũ đa chuyên môn</h1>
          <p className="text-base text-muted-foreground">
            Kết hợp kiến thức khoa học với trải nghiệm thực tế của hàng nghìn học viên, chúng tôi tạo nên chương trình phù hợp văn hoá ẩm thực Việt Nam.
          </p>
        </div>
      </section>
      <section className="container grid gap-6 md:grid-cols-3">
        {teamMembers.map(member => (
          <Card key={member.name} className="border-primary/10 bg-white/80">
            <CardContent className="space-y-4 p-8">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-primary">{member.name}</p>
                <p className="text-sm text-secondary-foreground">{member.role}</p>
              </div>
              <p className="text-sm text-muted-foreground">{member.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="container">
        <div className="rounded-[2.5rem] border border-primary/15 bg-primary/10 p-10 text-center">
          <h2 className="text-2xl font-semibold text-primary">Sứ mệnh</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Chúng tôi mong muốn mỗi gia đình Việt đều có thể tiếp cận kiến thức dinh dưỡng đúng đắn, xây dựng thói quen lành mạnh và truyền cảm hứng cho thế hệ tiếp theo.
          </p>
        </div>
      </section>
    </div>
  );
}

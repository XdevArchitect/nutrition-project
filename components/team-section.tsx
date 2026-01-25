import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { teamMembers } from "@/data/content";
import { User, Mail, Phone } from "lucide-react";

export function TeamSection() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-primary-900">Đội ngũ chuyên gia</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Đội ngũ chuyên gia dinh dưỡng với kinh nghiệm thực tiễn và nghiên cứu chuyên sâu.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {teamMembers.map(member => (
          <Card key={member.name} className="border-primary/10 bg-white/80">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-primary">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-full border border-primary/20 p-2 text-primary transition hover:bg-primary hover:text-white">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button className="rounded-full border border-primary/20 p-2 text-primary transition hover:bg-primary hover:text-white">
                    <Phone className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
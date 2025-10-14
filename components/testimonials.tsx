import {testimonials} from "@/data/content";
import {Card, CardContent} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export function Testimonials() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-primary-900 sm:text-4xl">Câu chuyện chuyển hoá</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Hơn 1.200 học viên đã tự tin thiết lập chế độ ăn và lối sống mới, không còn loay hoay giữa hàng nghìn thông tin dinh dưỡng.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map(item => (
          <Card key={item.name} className="border-primary/10 bg-white/80">
            <CardContent className="space-y-5 p-8">
              <p className="text-sm leading-relaxed text-neutral-700">“{item.quote}”</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{item.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-primary">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

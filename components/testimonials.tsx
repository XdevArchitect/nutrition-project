import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/data/content";

export function Testimonials() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-primary-900">Học viên nói gì về chúng tôi</h2>
        <p className="mt-3 text-base text-muted-foreground">
          Khám phá câu chuyện chuyển mình của những người đã thay đổi lối sống cùng Dinh Dưỡng Tối Ưu.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map(testimonial => (
          <Card key={testimonial.name} className="border-primary/10 bg-white/80">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="mt-4 text-muted-foreground">
                "{testimonial.quote}"
              </blockquote>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
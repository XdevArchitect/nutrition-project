import Link from "next/link";
import {Facebook, Instagram, Youtube} from "lucide-react";
import {Separator} from "@/components/ui/separator";

const footerLinks = [
  {
    title: "Tài nguyên",
    items: [
      {label: "Kiến thức nền tảng", href: "/knowledge"},
      {label: "Blog", href: "/knowledge"},
      {label: "Khoá học", href: "/courses"}
    ]
  },
  {
    title: "Hỗ trợ",
    items: [
      {label: "Câu hỏi thường gặp", href: "/courses#faq"},
      {label: "Liên hệ", href: "/contact"},
      {label: "Chính sách", href: "#"}
    ]
  }
];

const socials = [
  {label: "Facebook", href: "#", icon: Facebook},
  {label: "Instagram", href: "#", icon: Instagram},
  {label: "YouTube", href: "#", icon: Youtube}
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-primary/15 bg-primary/5">
      <div className="container grid gap-12 py-14 md:grid-cols-[2fr,1fr,1fr]">
        <div className="max-w-sm space-y-5">
          <h3 className="text-lg font-semibold text-primary">Dinh Dưỡng Tối Ưu</h3>
          <p className="text-sm text-muted-foreground">
            Kiến thức khoa học và chương trình học cá nhân hóa giúp bạn xây dựng lối sống lành mạnh, bền vững.
          </p>
          <div className="flex gap-3">
            {socials.map(social => (
              <Link key={social.label} href={social.href} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition hover:bg-primary hover:text-white">
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.label}</span>
              </Link>
            ))}
          </div>
        </div>
        {footerLinks.map(group => (
          <div key={group.title} className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">{group.title}</h4>
            <Separator className="w-12" />
            <ul className="space-y-2 text-sm text-muted-foreground">
              {group.items.map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="transition hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary/10 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dinh Dưỡng Tối Ưu. All rights reserved.
      </div>
    </footer>
  );
}

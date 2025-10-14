"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";

const links = [
  {href: "/", label: "Trang chủ"},
  {href: "/knowledge", label: "Kiến thức"},
  {href: "/courses", label: "Khoá học"},
  {href: "/about", label: "Về chúng tôi"},
  {href: "/contact", label: "Liên hệ"}
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/15 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-primary">Dinh Dưỡng Tối Ưu</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map(link => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link href={link.href} className={cn(navigationMenuTriggerStyle, pathname === link.href && "bg-primary/10 text-primary")}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button asChild>
            <Link href="/courses">Đăng ký học</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full max-w-sm">
            <nav className="mt-10 flex flex-col gap-4 text-base font-medium text-neutral-700">
              {links.map(link => (
                <Link key={link.href} href={link.href} className={pathname === link.href ? "text-primary" : undefined}>
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-6">
                <Link href="/courses">Đăng ký học</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

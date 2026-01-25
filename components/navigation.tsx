"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/", label: "Trang chủ" },
  { href: "/knowledge", label: "Kiến thức" },
  { href: "/courses", label: "Khoá học" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/contact", label: "Liên hệ" }
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

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
                    <Link 
                      href={link.href} 
                      className={cn(
                        navigationMenuTriggerStyle, 
                        pathname === link.href && "bg-primary/10 text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          {status === "loading" ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-primary/10" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Thông tin cá nhân</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Trang quản trị</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Link>
            </Button>
          )}
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
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={pathname === link.href ? "text-primary" : undefined}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="mt-6 pt-6 border-t border-primary/10">
                {status === "loading" ? (
                  <div className="h-10 w-full animate-pulse rounded-full bg-primary/10" />
                ) : session ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Xin chào, {session.user.name}</span>
                    <Button variant="outline" size="sm" onClick={() => signOut()}>
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Đăng nhập
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Film, Home, Menu, User } from "lucide-react";
import { ThemeToggle, ThemeToggleRow } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import silverbirdLogo from "@assets/ChatGPT_Image_Apr_3,_2026,_10_00_39_AM_1775206879120.png";

export function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileLinks = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Film, label: "Movies", href: "/movies" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <img
            src={silverbirdLogo}
            alt="Silverbird Cinemas"
            className="h-9 w-auto mix-blend-screen"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">Silverbird Cinemas</span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link
            href="/movies"
            className={`text-sm font-medium transition-colors hover:text-primary ${location === '/movies' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Movies
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link href="/admin/login" data-testid="link-admin-login">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="btn-mobile-menu">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-72 flex-col">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1">
              {mobileLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  <div
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted ${
                      location === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t pt-4">
              <ThemeToggleRow />
              <Link href="/admin/login" onClick={() => setMenuOpen(false)} data-testid="link-admin-login-mobile">
                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Admin Login
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

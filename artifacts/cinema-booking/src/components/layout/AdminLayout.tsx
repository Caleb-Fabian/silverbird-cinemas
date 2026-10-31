import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Film, 
  CalendarClock, 
  Ticket,
  LogOut,
  Menu
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle, ThemeToggleRow } from "@/components/ThemeToggle";
import silverbirdLogo from "@assets/ChatGPT_Image_Apr_3,_2026,_10_00_39_AM_1775206879120.png";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAdminAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!isAdminAuthenticated && location !== "/admin/login") {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Film, label: "Movies", href: "/admin/movies" },
    { icon: CalendarClock, label: "Showtimes", href: "/admin/showtimes" },
    { icon: Ticket, label: "Bookings", href: "/admin/bookings" },
  ];

  return (
    <div className="flex min-h-[100dvh] w-full bg-muted/20">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src={silverbirdLogo}
              alt="Silverbird Cinemas"
              className="h-7 w-auto mix-blend-screen"
            />
            <span className="text-sm">Silverbird Admin</span>
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted ${
                  location === item.href ? "bg-muted font-medium text-primary" : "text-muted-foreground"
                }`}
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground" 
            onClick={handleLogout}
            data-testid="btn-admin-logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 sm:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src={silverbirdLogo}
              alt="Silverbird Cinemas"
              className="h-7 w-auto mix-blend-screen"
            />
            <span className="text-sm">Silverbird Admin</span>
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" data-testid="btn-admin-mobile-menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col">
              <SheetHeader>
                <SheetTitle>Admin Dashboard</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-1">
                {navItems.map((item) => (
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
              <div className="flex flex-col gap-1 border-t pt-4">
                <ThemeToggleRow />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

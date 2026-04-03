import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Film, 
  CalendarClock, 
  Ticket, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import silverbirdLogo from "@assets/silverbird-logo_1775205994792.png";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAdminAuthenticated, logout } = useAuth();

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
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img
              src={silverbirdLogo}
              alt="Silverbird Cinemas"
              className="h-7 w-auto mix-blend-multiply dark:mix-blend-screen"
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

      {/* Main Content */}
      <main className="flex-1 sm:pl-64">
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import silverbirdLogo from "@assets/ChatGPT_Image_Apr_3,_2026,_10_00_39_AM_1775206879120.png";

export function Navbar() {
  const [location] = useLocation();

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

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/admin/login" data-testid="link-admin-login">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <User className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@cinebook.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@cinebook.com" && password === "admin123") {
      login();
      setLocation("/admin/dashboard");
    } else {
      setError("Invalid credentials. Use admin@cinebook.com / admin123");
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-muted/30 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Film className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">Admin Portal</h1>
          <p className="text-muted-foreground text-center mt-1">Sign in to manage CineBook</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              data-testid="input-admin-email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              data-testid="input-admin-password"
            />
          </div>
          
          {error && <p className="text-destructive text-sm font-medium">{error}</p>}
          
          <Button type="submit" className="w-full h-11" data-testid="btn-admin-submit">
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>admin@cinebook.com / admin123</p>
        </div>
      </motion.div>
    </div>
  );
}
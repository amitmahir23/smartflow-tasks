import { useState } from "react";
import { loginUser } from "@/lib/store";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderKanban } from "lucide-react";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    const user = loginUser(name.trim(), email.trim());
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
            <FolderKanban className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">TaskFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Smart task management, simplified</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <Button type="submit" className="w-full">Get Started</Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo mode — no real authentication
        </p>
      </div>
    </div>
  );
}

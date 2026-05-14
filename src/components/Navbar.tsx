import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/analytics", label: "Analytics" },
  { to: "/monitoring", label: "Monitoring" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground hover:text-primary transition-colors font-medium tracking-wide"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold tracking-wide">
              Get Started
            </Button>
          </Link>
          <button className="md:hidden p-2 text-foreground"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
    </header>
  );
}

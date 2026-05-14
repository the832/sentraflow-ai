import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import {
  LayoutDashboard,
  Activity,
  Brain,
  TrafficCone,
  FlaskConical,
  BarChart3,
  Siren,
  Settings,
  Map as MapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/map", label: "Traffic Map", icon: MapIcon },
  { to: "/monitoring", label: "Live Monitoring", icon: Activity },
  { to: "/prediction", label: "Traffic Prediction", icon: Brain },
  { to: "/signals", label: "Signal Control", icon: TrafficCone },
  { to: "/simulation", label: "Simulation", icon: FlaskConical },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/emergency", label: "Emergency", icon: Siren },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 border-r border-border/60 bg-card/40 backdrop-blur-xl p-4 sticky top-0 h-screen">
      <div className="px-2 py-2">
        <Link to="/"><Logo /></Link>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-3">Command Center</div>
      <nav className="flex-1 mt-2 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeProps={{ className: "bg-primary/10 text-primary glow-cyan border-primary/40" }}
            className={cn(
              "group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm text-muted-foreground transition-all hover:text-foreground hover:bg-secondary/50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
            <span className="font-medium tracking-wide">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="glass rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="pulse-dot" />
          <span className="text-lime-glow font-semibold">SYSTEM ONLINE</span>
        </div>
        <div className="text-muted-foreground font-mono">Latency: 12ms · Uptime 99.98%</div>
      </div>
    </aside>
  );
}

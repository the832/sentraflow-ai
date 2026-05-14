import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import {
  Car, AlertTriangle, Gauge, Activity, TrendingUp, TrendingDown, Cpu, Siren,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

export const Route = createFileRoute("/_console/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SentraFlow" }] }),
  component: Dashboard,
});

const trend = Array.from({ length: 18 }, (_, i) => ({
  t: `${6 + i}:00`,
  flow: 400 + Math.round(Math.sin(i / 2) * 200 + i * 20 + Math.random() * 80),
  pred: 400 + Math.round(Math.sin(i / 2) * 200 + i * 20),
}));
const dist = [
  { n: "Cars", v: 62, c: "oklch(0.85 0.18 195)" },
  { n: "Bikes", v: 18, c: "oklch(0.85 0.22 140)" },
  { n: "Buses", v: 9, c: "oklch(0.85 0.18 75)" },
  { n: "Trucks", v: 8, c: "oklch(0.7 0.15 280)" },
  { n: "Emergency", v: 3, c: "oklch(0.68 0.24 25)" },
];
const zones = Array.from({ length: 8 }, (_, i) => ({
  z: `Z-${i + 1}`, density: Math.round(30 + Math.random() * 70),
}));
const alerts = [
  { t: "Accident detected", l: "5th Ave & Pine", s: "danger", time: "12s ago" },
  { t: "Heavy congestion", l: "Sector 4 Highway", s: "warning", time: "1m ago" },
  { t: "Ambulance routed", l: "AMB-091 → St. Mary", s: "info", time: "3m ago" },
  { t: "Signal optimized", l: "Junction J-22", s: "ok", time: "8m ago" },
];

const stats = [
  { l: "Total Vehicles", v: "12,847", d: "+8.2%", up: true, icon: Car, glow: "cyan" as const },
  { l: "Congestion Level", v: "42%", d: "-3.1%", up: false, icon: Gauge, glow: "lime" as const },
  { l: "Avg Speed", v: "38 km/h", d: "+1.4 km/h", up: true, icon: Activity, glow: "cyan" as const },
  { l: "Active Alerts", v: "7", d: "2 critical", up: false, icon: AlertTriangle, glow: "lime" as const },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Command Center</div>
          <h1 className="font-display text-3xl md:text-4xl">Citywide Traffic Overview</h1>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs font-mono">
          <span className="pulse-dot" /> <span className="text-lime-glow">LIVE</span>
          <span className="text-muted-foreground">· Updated 2s ago</span>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <GlassCard key={s.l} glow={s.glow}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                <div className="font-display text-3xl mt-2">{s.v}</div>
                <div className={`mt-1 text-xs flex items-center gap-1 ${s.up ? "text-lime-glow" : "text-[var(--color-warning)]"}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.d}
                </div>
              </div>
              <s.icon className="h-6 w-6 text-primary" />
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-lg">Live City Traffic Heatmap</div>
            <div className="text-xs text-muted-foreground">12 monitored zones</div>
          </div>
          <div className="relative h-72 rounded-lg overflow-hidden border border-border bg-background">
            <div className="absolute inset-0 marquee-grid opacity-50" />
            {/* Roads */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="none">
              <path d="M 0 140 Q 100 120 200 140 T 400 140" stroke="oklch(0.85 0.18 195 / 0.4)" strokeWidth="2" fill="none" />
              <path d="M 200 0 L 200 280" stroke="oklch(0.85 0.22 140 / 0.3)" strokeWidth="2" fill="none" />
              <path d="M 0 70 L 400 70" stroke="oklch(0.85 0.18 195 / 0.2)" strokeWidth="1" fill="none" />
              <path d="M 0 210 L 400 210" stroke="oklch(0.85 0.18 195 / 0.2)" strokeWidth="1" fill="none" />
            </svg>
            {Array.from({ length: 26 }).map((_, i) => {
              const x = (i * 137) % 100;
              const y = (i * 53) % 100;
              const s = (i % 3) + 1;
              const c = i % 5 === 0 ? "var(--color-danger)" : i % 3 === 0 ? "var(--color-warning)" : "var(--color-lime)";
              return <span key={i} className="absolute rounded-full opacity-70 blur-md" style={{ left: `${x}%`, top: `${y}%`, width: s * 22, height: s * 22, background: c }} />;
            })}
          </div>
          <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-lime)]" /> Free</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--color-danger)]" /> Congested</span>
          </div>
        </GlassCard>

        <GlassCard glow="lime">
          <div className="font-display text-lg mb-3">Vehicle Distribution</div>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="v" nameKey="n" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {dist.map((d) => <Cell key={d.n} fill={d.c} stroke="oklch(0.16 0.03 245)" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="font-display text-lg mb-3">Traffic Trend (today vs AI prediction)</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="t" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Area dataKey="pred" stroke="oklch(0.85 0.22 140)" fill="transparent" strokeDasharray="4 4" />
                <Area dataKey="flow" stroke="oklch(0.85 0.18 195)" fill="url(#d1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="font-display text-lg mb-3">Recent Alerts</div>
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li key={a.t + a.time} className="flex items-start gap-3 rounded-md border border-border bg-secondary/30 p-2.5">
                <span className={`mt-1 h-2 w-2 rounded-full ${
                  a.s === "danger" ? "bg-[var(--color-danger)]" :
                  a.s === "warning" ? "bg-[var(--color-warning)]" :
                  a.s === "info" ? "bg-primary" : "bg-[var(--color-lime)]"
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.l}</div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{a.time}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <div className="font-display text-lg mb-3">Congestion by Zone</div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={zones}>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="z" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Bar dataKey="density" fill="oklch(0.85 0.18 195)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard glow="lime">
          <div className="font-display text-lg mb-3 flex items-center gap-2"><Cpu className="h-5 w-5 text-primary" /> AI Recommendations</div>
          <ul className="space-y-2 text-sm">
            {[
              { i: Siren, t: "Open green corridor for AMB-091 → St. Mary" },
              { i: Activity, t: "Extend NS green +6s at J-22" },
              { i: Car, t: "Reroute bus line 22 via Sector 4" },
              { i: AlertTriangle, t: "Increase camera FPS on Bridge-3" },
            ].map((r) => (
              <li key={r.t} className="flex items-start gap-2 rounded-md border border-border bg-secondary/30 p-2.5">
                <r.i className="h-4 w-4 mt-0.5 text-accent" />
                <span>{r.t}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

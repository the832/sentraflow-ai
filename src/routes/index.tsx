import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Cpu,
  TrafficCone,
  Siren,
  AlertTriangle,
  LineChart,
  ShieldCheck,
  Gauge,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentraFlow — AI Traffic Intelligence for Smarter Cities" },
      {
        name: "description",
        content:
          "SentraFlow is an AI-powered smart city traffic intelligence platform: real-time monitoring, congestion prediction, signal control, and emergency priority.",
      },
      { property: "og:title", content: "SentraFlow — AI Traffic Intelligence" },
      { property: "og:description", content: "Real-time AI traffic monitoring & smart signal optimization." },
    ],
  }),
  component: Landing,
});

const trend = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}:00`,
  flow: 600 + Math.round(Math.sin(i / 3) * 220 + Math.random() * 120 + i * 8),
  predicted: 600 + Math.round(Math.sin(i / 3) * 220 + i * 8),
}));

function Landing() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary">
              <span className="pulse-dot" /> AI · v3.0 Live
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05]">
              <span className="text-foreground">AI-Powered</span>{" "}
              <span className="text-neon">Traffic</span>{" "}
              <span className="text-foreground">Intelligence</span>{" "}
              <span className="text-lime-glow">for Smarter Cities</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              SentraFlow fuses real-time computer vision, predictive AI and adaptive
              signal control into one unified command center — eliminating congestion
              before it happens.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold tracking-wide">
                  Launch Command Center <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/analytics">
                <Button size="lg" variant="outline" className="border-accent/50 text-accent hover:bg-accent/10 hover:text-accent font-semibold tracking-wide">
                  View Live Analytics
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "98%", l: "Accuracy" },
                { v: "12ms", l: "Latency" },
                { v: "5K+", l: "Signals" },
              ].map((s) => (
                <div key={s.l} className="glass rounded-lg p-3 text-center">
                  <div className="font-display text-2xl text-neon">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <GlassCard glow="cyan" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">City Flow · Live</div>
                  <div className="font-display text-2xl text-foreground">Sector 7 — Downtown</div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-lime-glow">
                  <span className="pulse-dot" /> STREAMING
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.85 0.22 140)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.85 0.22 140)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.1)" vertical={false} />
                    <XAxis dataKey="h" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                    <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                    <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                    <Area dataKey="predicted" stroke="oklch(0.85 0.22 140)" fill="url(#g2)" strokeDasharray="4 4" />
                    <Area dataKey="flow" stroke="oklch(0.85 0.18 195)" fill="url(#g1)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                {[
                  { l: "North Lane", v: "Free", c: "text-lime-glow" },
                  { l: "East Lane", v: "Moderate", c: "text-[var(--color-warning)]" },
                  { l: "South Lane", v: "Congested", c: "text-[var(--color-danger)]" },
                ].map((x) => (
                  <div key={x.l} className="rounded-md border border-border bg-secondary/40 p-2">
                    <div className="text-muted-foreground">{x.l}</div>
                    <div className={`font-semibold ${x.c}`}>{x.v}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 border-y border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { v: "98%", l: "Prediction Accuracy", icon: Cpu },
            { v: "5,000+", l: "Vehicles Monitored", icon: Gauge },
            { v: "120+", l: "Smart Signals", icon: TrafficCone },
            { v: "24/7", l: "AI Monitoring", icon: Radio },
          ].map((s, i) => (
            <GlassCard key={s.l} className="text-center" transition={{ delay: i * 0.1, duration: 0.5 }}>
              <s.icon className="mx-auto h-7 w-7 text-primary" />
              <div className="font-display text-4xl text-neon mt-3">{s.v}</div>
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">{s.l}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.3em] text-accent">Modules</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">
              An entire <span className="text-neon">AI traffic OS</span>
            </h2>
            <p className="mt-3 text-muted-foreground">Five integrated modules. One adaptive nervous system for the city.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: TrafficCone, t: "Smart Signal AI", d: "Reinforcement-learning controllers tune signal phases in real time across the corridor." },
              { icon: Cpu, t: "Congestion Prediction", d: "Forecast jams 30 min ahead with spatio-temporal graph networks." },
              { icon: Siren, t: "Emergency Priority", d: "Auto-cleared green corridors for ambulances, fire and police." },
              { icon: AlertTriangle, t: "Accident Detection", d: "Multi-camera vision detects collisions in <2s and dispatches responders." },
              { icon: LineChart, t: "Real-Time Analytics", d: "City-scale dashboards with pollution, density and speed analytics." },
              { icon: ShieldCheck, t: "Adaptive Safety", d: "Risk scoring of intersections with AI-suggested infrastructure fixes." },
            ].map((f, i) => (
              <GlassCard key={f.t} glow={i % 2 ? "lime" : "cyan"} transition={{ delay: i * 0.05, duration: 0.5 }}>
                <f.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 font-display text-xl">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-3 gap-5">
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-display text-lg">Live City Heatmap</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Real-time density · Sector Grid</div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-lime-glow">
                  <span className="pulse-dot" /> 12 ZONES LIVE
                </div>
              </div>

              {/* Overlay stat chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {[
                  { l: "Congestion", v: "73%", c: "text-[var(--color-danger)]", dot: "var(--color-danger)" },
                  { l: "Active Signals", v: "118", c: "text-primary", dot: "var(--color-cyan)" },
                  { l: "Emergency", v: "2", c: "text-[var(--color-warning)]", dot: "var(--color-warning)" },
                  { l: "Vehicles", v: "5,284", c: "text-lime-glow", dot: "var(--color-lime)" },
                ].map((s) => (
                  <div key={s.l} className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 py-1.5">
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: s.dot, boxShadow: `0 0 8px ${s.dot}` }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] uppercase tracking-widest text-muted-foreground truncate">{s.l}</div>
                      <div className={`font-display text-sm ${s.c}`}>{s.v}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative h-64 rounded-lg overflow-hidden border border-border bg-background">
                <div className="absolute inset-0 marquee-grid opacity-50" />
                {Array.from({ length: 30 }).map((_, i) => {
                  const x = (i * 137) % 100;
                  const y = (i * 53) % 100;
                  const s = (i % 3) + 1;
                  const c = i % 4 === 0 ? "var(--color-danger)" : i % 3 === 0 ? "var(--color-warning)" : "var(--color-lime)";
                  return (
                    <motion.span
                      key={i}
                      className="absolute rounded-full blur-md"
                      style={{ left: `${x}%`, top: `${y}%`, width: s * 18, height: s * 18, background: c }}
                      animate={{ opacity: [0.4, 0.85, 0.4], scale: [1, 1.15, 1] }}
                      transition={{ duration: 2 + (i % 4) * 0.4, repeat: Infinity, delay: (i % 5) * 0.2 }}
                    />
                  );
                })}

                {/* Scanline */}
                <motion.div
                  className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ boxShadow: "0 0 12px var(--color-cyan)" }}
                />

                {/* Legend */}
                <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded-md bg-background/70 backdrop-blur px-2.5 py-1 border border-border text-[10px] font-mono">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-lime)" }} /> Free</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-warning)" }} /> Moderate</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--color-danger)" }} /> Critical</span>
                </div>

                {/* Avg speed badge */}
                <div className="absolute top-2 right-2 rounded-md bg-background/70 backdrop-blur px-2.5 py-1 border border-primary/40 text-[10px] font-mono text-primary">
                  AVG · 42 km/h
                </div>
              </div>
            </GlassCard>
            <GlassCard glow="lime">
              <div className="font-display text-lg">AI Recommendations</div>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  "Extend NS green by 6s on 5th Ave intersection",
                  "Re-route bus line 22 via Sector 4",
                  "Open green corridor for AMB-091",
                  "Increase camera FPS on Bridge-3",
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 rounded-md border border-border bg-secondary/30 p-2">
                    <span className="pulse-dot mt-1.5" />
                    <span className="text-foreground/90">{r}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <GlassCard glow="cyan" className="text-center p-10">
            <h2 className="font-display text-4xl md:text-5xl">Build the city's <span className="text-lime-glow">nervous system</span>.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Deploy SentraFlow in your municipality and turn raw signals into intelligent flow.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/dashboard"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">Open Dashboard</Button></Link>
              <Link to="/contact"><Button size="lg" variant="outline" className="border-primary/40 text-foreground hover:bg-primary/10">Contact Team</Button></Link>
            </div>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-display text-foreground text-lg">SentraFlow</div>
            <p className="mt-2 text-muted-foreground">AI nervous system for modern cities.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Product</div>
            <ul className="space-y-1 text-muted-foreground">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/analytics">Analytics</Link></li>
              <li><Link to="/simulation">Simulation</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Company</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>About</li><li>Team</li><li>Careers</li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-2">Contact</div>
            <ul className="space-y-1 text-muted-foreground">
              <li>hello@sentraflow.ai</li><li>+1 (555) 010-2042</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SentraFlow Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

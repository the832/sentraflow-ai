import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Camera, Car, Bus, Bike, Truck, Siren, ScanLine } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_console/monitoring")({
  head: () => ({ meta: [{ title: "Live Monitoring · SentraFlow" }] }),
  component: Monitoring,
});

const detections = [
  { icon: Car, n: "Cars", c: 142, conf: 0.98 },
  { icon: Bike, n: "Bikes", c: 38, conf: 0.94 },
  { icon: Bus, n: "Buses", c: 9, conf: 0.97 },
  { icon: Truck, n: "Trucks", c: 11, conf: 0.96 },
  { icon: Siren, n: "Emergency", c: 1, conf: 0.99 },
];

const lanes = [
  { l: "Lane 1 (NB)", d: 78 },
  { l: "Lane 2 (NB)", d: 54 },
  { l: "Lane 3 (SB)", d: 36 },
  { l: "Lane 4 (SB)", d: 89 },
];

function Monitoring() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Vision · YOLO v8</div>
          <h1 className="font-display text-3xl md:text-4xl">Live Traffic Monitoring</h1>
        </div>
        <div className="glass rounded-lg px-3 py-2 text-xs font-mono flex items-center gap-2">
          <span className="pulse-dot" /> <span className="text-lime-glow">CAM-07 · 60 FPS</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard glow="cyan" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-lg flex items-center gap-2"><Camera className="h-5 w-5 text-primary" /> Camera Feed — 5th Ave</div>
            <div className="text-xs font-mono text-muted-foreground">REC · 00:{String(tick).padStart(2, "0")}</div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-primary/30 bg-black">
            {/* Holographic road */}
            <div className="absolute inset-0 grid-bg opacity-40" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
              <defs>
                <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.2 0.04 250)" />
                  <stop offset="100%" stopColor="oklch(0.1 0.02 240)" />
                </linearGradient>
              </defs>
              <polygon points="350,80 450,80 700,420 100,420" fill="url(#road)" />
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1={400} y1={80 + i * 70} x2={400} y2={120 + i * 70} stroke="oklch(0.85 0.18 195 / 0.6)" strokeWidth="3" strokeDasharray="6 8" />
              ))}
            </svg>
            {/* Bounding boxes */}
            {[
              { x: 30, y: 40, w: 18, h: 12, l: "car 0.98" },
              { x: 55, y: 55, w: 14, h: 10, l: "car 0.96" },
              { x: 22, y: 70, w: 20, h: 14, l: "bus 0.97" },
              { x: 65, y: 30, w: 12, h: 8, l: "bike 0.92" },
              { x: 45, y: 78, w: 22, h: 14, l: "truck 0.95" },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="absolute border-2 border-[var(--color-lime)] rounded-sm"
                style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <div className="absolute -top-5 left-0 bg-[var(--color-lime)] text-[10px] text-background px-1 font-mono font-bold">{b.l}</div>
              </motion.div>
            ))}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute top-3 left-3 text-xs font-mono text-primary flex items-center gap-2">
              <ScanLine className="h-4 w-4" /> AI VISION ACTIVE
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="lime">
          <div className="font-display text-lg mb-3">Detections (last 60s)</div>
          <ul className="space-y-2">
            {detections.map((d) => (
              <li key={d.n} className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 p-2.5">
                <d.icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{d.n}</div>
                  <div className="text-xs text-muted-foreground">Confidence {(d.conf * 100).toFixed(0)}%</div>
                </div>
                <div className="font-display text-2xl text-neon">{d.c}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="font-display text-lg mb-3">Lane Density Analysis</div>
        <div className="grid md:grid-cols-4 gap-3">
          {lanes.map((l) => (
            <div key={l.l} className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{l.l}</span>
                <span className="font-mono text-foreground">{l.d}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ background: l.d > 70 ? "var(--color-danger)" : l.d > 50 ? "var(--color-warning)" : "var(--color-lime)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${l.d}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

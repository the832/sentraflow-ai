import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Siren, Navigation, Clock, TrafficCone, Activity } from "lucide-react";

export const Route = createFileRoute("/_console/emergency")({
  head: () => ({ meta: [{ title: "Emergency Priority · SentraFlow" }] }),
  component: Emergency,
});

const alerts = [
  { id: "AMB-091", t: "Ambulance", from: "Pine & 7th", to: "St. Mary Hospital", eta: "4:12", status: "EN ROUTE" },
  { id: "FIRE-12", t: "Fire Truck", from: "Station 4", to: "Industrial Park", eta: "6:48", status: "DISPATCHED" },
  { id: "POL-203", t: "Police", from: "HQ", to: "5th Ave", eta: "2:30", status: "EN ROUTE" },
];

function Emergency() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-danger)]">Priority Override</div>
          <h1 className="font-display text-3xl md:text-4xl">Emergency Vehicle System</h1>
        </div>
        <div className="glass rounded-lg px-3 py-2 text-xs font-mono flex items-center gap-2 border-[var(--color-danger)]/40">
          <span className="pulse-dot" style={{ background: "var(--color-danger)" }} /> 3 ACTIVE
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard glow="cyan" className="lg:col-span-2">
          <div className="font-display text-lg mb-3">Live Route — AMB-091</div>
          <div className="relative h-80 rounded-lg overflow-hidden border border-border bg-background">
            <div className="absolute inset-0 marquee-grid opacity-30" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
              {/* Roads */}
              <g stroke="oklch(0.85 0.18 195 / 0.25)" strokeWidth="2" fill="none">
                <path d="M 0 100 H 800" />
                <path d="M 0 200 H 800" />
                <path d="M 0 300 H 800" />
                <path d="M 200 0 V 400" />
                <path d="M 400 0 V 400" />
                <path d="M 600 0 V 400" />
              </g>
              {/* Optimized green corridor */}
              <motion.path
                d="M 80 320 L 200 320 L 200 200 L 400 200 L 400 100 L 720 100"
                stroke="var(--color-lime)"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                filter="drop-shadow(0 0 6px oklch(0.85 0.22 140))"
              />
              {/* Start / End markers */}
              <circle cx="80" cy="320" r="8" fill="oklch(0.68 0.24 25)" />
              <circle cx="720" cy="100" r="8" fill="oklch(0.85 0.22 140)" />
            </svg>

            {/* Moving ambulance */}
            <motion.div
              className="absolute h-7 w-7 rounded-full bg-[var(--color-danger)] flex items-center justify-center glow-cyan"
              animate={{
                left: ["10%", "25%", "25%", "50%", "50%", "90%"],
                top: ["80%", "80%", "50%", "50%", "25%", "25%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Siren className="h-4 w-4 text-white" />
            </motion.div>

            <div className="absolute top-3 left-3 glass rounded-md px-3 py-2 text-xs">
              <div className="text-[10px] uppercase text-muted-foreground">ETA</div>
              <div className="font-display text-xl text-lime-glow">4:12</div>
            </div>
            <div className="absolute top-3 right-3 glass rounded-md px-3 py-2 text-xs">
              <div className="text-[10px] uppercase text-muted-foreground">Signals Cleared</div>
              <div className="font-display text-xl text-neon">7 / 9</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="lime">
          <div className="font-display text-lg mb-3">Active Emergencies</div>
          <ul className="space-y-2">
            {alerts.map((a) => (
              <li key={a.id} className="rounded-md border border-border bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-neon">{a.id}</span>
                  <span className="text-[10px] font-mono text-lime-glow">{a.status}</span>
                </div>
                <div className="text-sm font-semibold mt-1">{a.t}</div>
                <div className="text-xs text-muted-foreground">{a.from} → {a.to}</div>
                <div className="mt-2 flex items-center gap-1 text-xs"><Clock className="h-3 w-3 text-accent" /> ETA <span className="text-foreground font-mono ml-1">{a.eta}</span></div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { i: TrafficCone, l: "Signals Pre-empted", v: "7" },
          { i: Navigation, l: "Optimized Routes", v: "3" },
          { i: Activity, l: "Avg Response Time", v: "4m 12s" },
        ].map((s) => (
          <GlassCard key={s.l}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                <div className="font-display text-2xl mt-1 text-neon">{s.v}</div>
              </div>
              <s.i className="h-6 w-6 text-primary" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

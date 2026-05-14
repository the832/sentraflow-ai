import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { TrafficCone, Siren, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_console/signals")({
  head: () => ({ meta: [{ title: "Signal Control · SentraFlow" }] }),
  component: Signals,
});

type Phase = "NS" | "EW";

function Signals() {
  const [phase, setPhase] = useState<Phase>("NS");
  const [time, setTime] = useState(28);
  const [aiMode, setAiMode] = useState(true);
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setPhase((p) => (p === "NS" ? "EW" : "NS"));
          return 30;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Junction J-22 · 5th & Pine</div>
          <h1 className="font-display text-3xl md:text-4xl">Smart Signal Control</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAiMode(!aiMode)} className={aiMode ? "bg-primary text-primary-foreground glow-cyan" : "bg-secondary text-foreground"}>
            {aiMode ? "AI MODE" : "MANUAL"}
          </Button>
          <Button onClick={() => setEmergency(!emergency)} className={emergency ? "bg-[var(--color-danger)] text-white glow-cyan" : "bg-secondary text-foreground"}>
            <Siren className="h-4 w-4 mr-1" /> Emergency Override
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard glow="cyan" className="lg:col-span-2">
          <div className="font-display text-lg mb-3">Intersection Visualization</div>
          <div className="relative aspect-square max-w-[520px] mx-auto rounded-lg overflow-hidden border border-border bg-background">
            <div className="absolute inset-0 grid-bg opacity-30" />
            {/* Roads cross */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-24 bg-secondary border-y border-primary/30" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-24 bg-secondary border-x border-primary/30" />
            {/* Lane dashes */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-px h-px bg-[var(--color-lime)]/40" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-px bg-[var(--color-lime)]/40" />

            {/* Moving cars */}
            {phase === "NS" && Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`ns${i}`}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-6 rounded bg-primary glow-cyan"
                animate={{ y: [-200, 600] }}
                transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "linear" }}
                style={{ top: 0 }}
              />
            ))}
            {phase === "EW" && Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`ew${i}`}
                className="absolute top-1/2 -translate-y-1/2 h-4 w-6 rounded bg-accent glow-lime"
                animate={{ x: [-200, 600] }}
                transition={{ duration: 4, delay: i * 0.6, repeat: Infinity, ease: "linear" }}
                style={{ left: 0 }}
              />
            ))}

            {/* Signals at corners */}
            <SignalLight pos="top-2 left-2" active={phase === "NS"} />
            <SignalLight pos="bottom-2 right-2" active={phase === "NS"} />
            <SignalLight pos="top-2 right-2" active={phase === "EW"} />
            <SignalLight pos="bottom-2 left-2" active={phase === "EW"} />

            {/* Center HUD */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 glass rounded-lg px-4 py-2 text-center">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Phase</div>
              <div className="font-display text-xl text-neon">{phase === "NS" ? "North ↔ South" : "East ↔ West"}</div>
              <div className="font-mono text-3xl text-lime-glow">{String(time).padStart(2, "0")}s</div>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard glow="lime">
            <div className="font-display text-lg mb-3 flex items-center gap-2"><TrafficCone className="h-5 w-5 text-primary" /> Lane Status</div>
            <ul className="space-y-2 text-sm">
              {[
                { l: "North-South", a: phase === "NS", d: 72 },
                { l: "East-West", a: phase === "EW", d: 54 },
              ].map((x) => (
                <li key={x.l} className="rounded-md border border-border bg-secondary/30 p-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">{x.l}</span>
                    <span className={x.a ? "text-lime-glow" : "text-[var(--color-danger)]"}>{x.a ? "GREEN" : "RED"}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${x.d}%` }} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Density {x.d}%</div>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <div className="font-display text-lg mb-3 flex items-center gap-2"><Zap className="h-5 w-5 text-accent" /> AI Optimization</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Suggested NS green</span><span className="text-foreground font-mono">+6s</span></div>
              <div className="flex justify-between"><span>Cycle length</span><span className="text-foreground font-mono">90s</span></div>
              <div className="flex justify-between"><span>Throughput gain</span><span className="text-lime-glow font-mono">+18%</span></div>
              <div className="flex justify-between"><span>Avg wait reduction</span><span className="text-lime-glow font-mono">-22%</span></div>
            </div>
            <Button className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90 glow-lime">Apply AI Plan</Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SignalLight({ pos, active }: { pos: string; active: boolean }) {
  return (
    <div className={`absolute ${pos} flex flex-col gap-1 p-1.5 bg-black border border-border rounded-md`}>
      <div className={`h-3 w-3 rounded-full ${!active ? "bg-[var(--color-danger)] glow-cyan" : "bg-[var(--color-danger)]/20"}`} />
      <div className="h-3 w-3 rounded-full bg-[var(--color-warning)]/20" />
      <div className={`h-3 w-3 rounded-full ${active ? "bg-[var(--color-lime)] glow-lime" : "bg-[var(--color-lime)]/20"}`} />
    </div>
  );
}

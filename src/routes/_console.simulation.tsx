import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FlaskConical, ArrowRight } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_console/simulation")({
  head: () => ({ meta: [{ title: "Simulation · SentraFlow" }] }),
  component: Simulation,
});

const scenarios = [
  { id: "widen", name: "Road Widening" },
  { id: "flyover", name: "Flyover Construction" },
  { id: "oneway", name: "One-Way Conversion" },
  { id: "closure", name: "Road Closure" },
  { id: "signal", name: "Signal Timing Adjust" },
];

function Simulation() {
  const [active, setActive] = useState("widen");
  const data = [
    { metric: "Avg Speed", before: 28, after: 41 },
    { metric: "Wait (s)", before: 78, after: 42 },
    { metric: "Throughput", before: 1200, after: 1680 },
    { metric: "CO₂ (kg/h)", before: 240, after: 168 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Digital Twin</div>
          <h1 className="font-display text-3xl md:text-4xl">Traffic Simulation Lab</h1>
        </div>
        <Button className="bg-primary text-primary-foreground glow-cyan">
          <FlaskConical className="h-4 w-4 mr-1" /> Run Simulation
        </Button>
      </header>

      <div className="grid lg:grid-cols-4 gap-4">
        <GlassCard className="lg:col-span-1">
          <div className="font-display text-lg mb-3">Scenarios</div>
          <ul className="space-y-2">
            {scenarios.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left rounded-md border p-3 text-sm transition ${
                    active === s.id ? "border-primary bg-primary/10 text-primary glow-cyan" : "border-border bg-secondary/30 hover:border-primary/40"
                  }`}
                >
                  {s.name}
                </button>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard glow="cyan" className="lg:col-span-3">
          <div className="font-display text-lg mb-3">Before vs After — {scenarios.find((s) => s.id === active)?.name}</div>
          <div className="grid md:grid-cols-2 gap-4">
            <SimMap label="Before" tone="warning" />
            <SimMap label="After" tone="lime" />
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="metric" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="before" fill="oklch(0.85 0.18 75)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="after" fill="oklch(0.85 0.22 140)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard glow="lime">
        <div className="font-display text-lg mb-3">AI Recommendations</div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            "Widening 5th Ave by one lane reduces peak congestion by 32%",
            "Adding flyover at J-15 cuts cross traffic delay by 47%",
            "Converting Pine St to one-way improves throughput by 21%",
            "Phase re-balancing across corridor saves 4.2t CO₂/day",
          ].map((r) => (
            <li key={r} className="flex items-center gap-2 rounded-md border border-border bg-secondary/30 p-3">
              <ArrowRight className="h-4 w-4 text-accent" /> {r}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function SimMap({ label, tone }: { label: string; tone: "warning" | "lime" }) {
  return (
    <div className="relative h-48 rounded-lg overflow-hidden border border-border bg-background">
      <div className="absolute inset-0 marquee-grid opacity-30" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d="M 0 100 Q 100 60 200 100 T 400 100" stroke={tone === "lime" ? "var(--color-lime)" : "var(--color-warning)"} strokeWidth="3" fill="none" />
        <path d="M 200 0 L 200 200" stroke="oklch(0.85 0.18 195 / 0.4)" strokeWidth="2" fill="none" />
      </svg>
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 73) % 100;
        const y = (i * 37) % 100;
        const big = tone === "warning" && i % 3 === 0;
        return <span key={i} className="absolute rounded-full opacity-70 blur-md" style={{ left: `${x}%`, top: `${y}%`, width: big ? 30 : 14, height: big ? 30 : 14, background: tone === "lime" ? "var(--color-lime)" : "var(--color-danger)" }} />;
      })}
      <div className="absolute top-2 left-2 text-xs font-mono uppercase text-foreground/80 bg-background/60 px-2 py-1 rounded">{label}</div>
    </div>
  );
}

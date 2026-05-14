import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/_console/prediction")({
  head: () => ({ meta: [{ title: "Traffic Prediction · SentraFlow" }] }),
  component: Prediction,
});

const data = Array.from({ length: 36 }, (_, i) => ({
  t: `+${i * 5}m`,
  actual: i < 12 ? 50 + Math.sin(i / 2) * 20 + Math.random() * 8 : null,
  predicted: 50 + Math.sin(i / 2) * 20 + (i > 18 ? 25 : 0),
  upper: 50 + Math.sin(i / 2) * 20 + (i > 18 ? 25 : 0) + 8,
  lower: 50 + Math.sin(i / 2) * 20 + (i > 18 ? 25 : 0) - 8,
}));

function Prediction() {
  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">Spatio-Temporal Graph Net</div>
        <h1 className="font-display text-3xl md:text-4xl">AI Traffic Prediction</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Model Accuracy", v: "97.8%" },
          { l: "Forecast Horizon", v: "30 min" },
          { l: "Sensors", v: "1,284" },
          { l: "Last Trained", v: "2h ago" },
        ].map((s) => (
          <GlassCard key={s.l}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl text-neon mt-1">{s.v}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard glow="cyan">
        <div className="font-display text-lg mb-3">Congestion Forecast — Sector 7</div>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
              <XAxis dataKey="t" stroke="oklch(0.7 0.04 220)" fontSize={10} />
              <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
              <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="upper" stroke="oklch(0.85 0.22 140 / 0.4)" strokeDasharray="3 3" dot={false} />
              <Line dataKey="lower" stroke="oklch(0.85 0.22 140 / 0.4)" strokeDasharray="3 3" dot={false} />
              <Line dataKey="predicted" stroke="oklch(0.85 0.22 140)" strokeWidth={2} dot={false} />
              <Line dataKey="actual" stroke="oklch(0.85 0.18 195)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard glow="lime">
        <div className="font-display text-lg mb-3">Predicted Hotspots (next 30 min)</div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            { l: "5th Ave & Pine", p: "92%" },
            { l: "Bridge-3 Eastbound", p: "87%" },
            { l: "Sector 4 Highway", p: "78%" },
            { l: "Downtown Loop", p: "71%" },
          ].map((h) => (
            <li key={h.l} className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3">
              <span>{h.l}</span><span className="font-mono text-[var(--color-warning)]">{h.p}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

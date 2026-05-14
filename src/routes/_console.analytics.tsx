import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/_console/analytics")({
  head: () => ({ meta: [{ title: "Analytics · SentraFlow" }] }),
  component: Analytics,
});

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  d, vehicles: 8000 + Math.round(Math.sin(i) * 1500 + i * 400 + Math.random() * 800),
  accidents: Math.round(2 + Math.random() * 5),
  pollution: 60 + Math.round(Math.sin(i / 2) * 15 + Math.random() * 10),
}));
const peak = Array.from({ length: 24 }, (_, h) => ({
  h: `${h}`,
  congestion: Math.round(20 + Math.sin((h - 8) / 3) * 35 + (h > 7 && h < 10 ? 25 : 0) + (h > 16 && h < 19 ? 30 : 0) + Math.random() * 10),
}));
const radar = [
  { k: "Safety", v: 86 },
  { k: "Flow", v: 78 },
  { k: "Speed", v: 72 },
  { k: "Air Quality", v: 64 },
  { k: "Reliability", v: 92 },
  { k: "Coverage", v: 88 },
];

function Analytics() {
  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">City-Scale</div>
        <h1 className="font-display text-3xl md:text-4xl">Traffic Analytics</h1>
      </header>

      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2" glow="cyan">
          <div className="font-display text-lg mb-3">Weekly Vehicle Throughput</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={week}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Area dataKey="vehicles" stroke="oklch(0.85 0.18 195)" fill="url(#a1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard glow="lime">
          <div className="font-display text-lg mb-3">City Health Index</div>
          <div className="h-64">
            <ResponsiveContainer>
              <RadarChart data={radar}>
                <PolarGrid stroke="oklch(0.85 0.18 195 / 0.2)" />
                <PolarAngleAxis dataKey="k" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <PolarRadiusAxis stroke="oklch(0.7 0.04 220)" fontSize={9} />
                <Radar dataKey="v" stroke="oklch(0.85 0.22 140)" fill="oklch(0.85 0.22 140)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard>
          <div className="font-display text-lg mb-3">Peak Hour Congestion</div>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={peak}>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="h" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Line dataKey="congestion" stroke="oklch(0.85 0.18 195)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="font-display text-lg mb-3">Accidents & Pollution</div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={week}>
                <CartesianGrid stroke="oklch(0.85 0.18 195 / 0.08)" vertical={false} />
                <XAxis dataKey="d" stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <YAxis stroke="oklch(0.7 0.04 220)" fontSize={10} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.03 245)", border: "1px solid oklch(0.85 0.18 195 / 0.3)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="accidents" fill="oklch(0.68 0.24 25)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pollution" fill="oklch(0.85 0.22 140)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard glow="lime">
        <div className="font-display text-lg mb-3">AI Insights</div>
        <ul className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            "Peak congestion shifted 22 min earlier vs last month",
            "Accident risk hotspots: J-22, Bridge-3, Pine & 5th",
            "Pollution down 12% in Sector 7 after corridor optimization",
            "Recommend extending green wave to Sector 4 weekday mornings",
          ].map((i) => (
            <li key={i} className="rounded-md border border-border bg-secondary/30 p-3">{i}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

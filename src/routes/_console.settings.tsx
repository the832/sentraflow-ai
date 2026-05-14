import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_console/settings")({
  head: () => ({ meta: [{ title: "Settings · SentraFlow" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <div className="text-xs uppercase tracking-[0.3em] text-primary">System</div>
        <h1 className="font-display text-3xl md:text-4xl">Settings</h1>
      </header>

      <GlassCard>
        <div className="font-display text-lg mb-4">AI & Detection</div>
        <div className="space-y-4">
          {[
            { l: "Enable AI Signal Optimization", d: "Adaptive RL controllers across all corridors", on: true },
            { l: "Real-time Vehicle Detection", d: "YOLO v8 inference on live camera streams", on: true },
            { l: "Predictive Congestion Alerts", d: "30-minute forecast push notifications", on: true },
            { l: "Emergency Vehicle Auto-Override", d: "Auto-clear corridors for AMB / FIRE / POL", on: true },
            { l: "Beta Models", d: "Use experimental ST-GNN ensemble", on: false },
          ].map((o) => (
            <div key={o.l} className="flex items-center justify-between rounded-md border border-border bg-secondary/30 p-3">
              <div>
                <div className="text-sm font-semibold">{o.l}</div>
                <div className="text-xs text-muted-foreground">{o.d}</div>
              </div>
              <Switch defaultChecked={o.on} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

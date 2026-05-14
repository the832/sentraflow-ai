import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const SmartTrafficMap = lazy(() =>
  import("@/components/SmartTrafficMap").then((m) => ({ default: m.SmartTrafficMap })),
);

export const Route = createFileRoute("/_console/map")({
  head: () => ({ meta: [{ title: "Smart Traffic Map · SentraFlow" }] }),
  component: MapPage,
});

function MapPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Geospatial Intelligence</div>
          <h1 className="font-display text-3xl md:text-4xl">Smart Traffic Map</h1>
          <p className="text-sm text-muted-foreground mt-1">Live heatmap · AI signal grid · emergency corridors</p>
        </div>
      </header>
      {mounted && (
        <Suspense fallback={<div className="h-[520px] glass holo-border rounded-xl flex items-center justify-center text-neon text-xs uppercase tracking-[0.3em]">Loading Grid…</div>}>
          <SmartTrafficMap />
        </Suspense>
      )}
    </div>
  );
}

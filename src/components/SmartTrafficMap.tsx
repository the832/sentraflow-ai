import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Polyline,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Siren,
  TrafficCone,
  Brain,
  Gauge,
  AlertTriangle,
  Radio,
  Zap,
} from "lucide-react";

// City center (San Francisco-ish coordinates for visual demo)
const CENTER: [number, number] = [37.7749, -122.4194];

type SignalStatus = "RED" | "GREEN" | "YELLOW";

type Signal = {
  id: string;
  name: string;
  pos: [number, number];
  status: SignalStatus;
  countdown: number;
  congestion: "Low" | "Medium" | "High";
  density: number;
  ai: string;
  timing: string;
};

type HeatZone = {
  id: string;
  pos: [number, number];
  level: "low" | "medium" | "high";
  radius: number;
};

const initialSignals: Signal[] = [
  { id: "SIG-01", name: "Market & 5th", pos: [37.7820, -122.4080], status: "GREEN", countdown: 24, congestion: "High", density: 87, ai: "Extend green +12s — heavy westbound flow", timing: "G:45s · Y:4s · R:30s" },
  { id: "SIG-02", name: "Mission & 16th", pos: [37.7650, -122.4194], status: "RED", countdown: 18, congestion: "Medium", density: 54, ai: "Hold red — pedestrian surge detected", timing: "G:30s · Y:4s · R:35s" },
  { id: "SIG-03", name: "Van Ness & Geary", pos: [37.7860, -122.4220], status: "YELLOW", countdown: 3, congestion: "Low", density: 22, ai: "Standard cycle optimal", timing: "G:35s · Y:4s · R:30s" },
  { id: "SIG-04", name: "Embarcadero & Bay", pos: [37.7990, -122.4040], status: "GREEN", countdown: 31, congestion: "High", density: 92, ai: "Pre-empt for emergency vehicle", timing: "G:50s · Y:4s · R:25s" },
  { id: "SIG-05", name: "Folsom & 8th", pos: [37.7740, -122.4060], status: "RED", countdown: 12, congestion: "Medium", density: 61, ai: "Reduce red −8s — eastbound queue", timing: "G:32s · Y:4s · R:28s" },
];

const heatZones: HeatZone[] = [
  { id: "h1", pos: [37.7820, -122.4080], level: "high", radius: 380 },
  { id: "h2", pos: [37.7990, -122.4040], level: "high", radius: 420 },
  { id: "h3", pos: [37.7650, -122.4194], level: "medium", radius: 340 },
  { id: "h4", pos: [37.7740, -122.4060], level: "medium", radius: 300 },
  { id: "h5", pos: [37.7860, -122.4220], level: "low", radius: 280 },
  { id: "h6", pos: [37.7700, -122.4300], level: "low", radius: 260 },
  { id: "h7", pos: [37.7900, -122.4150], level: "medium", radius: 320 },
];

// Ambulance route waypoints (lat/lng)
const ambulanceRoute: [number, number][] = [
  [37.7600, -122.4300],
  [37.7680, -122.4250],
  [37.7740, -122.4180],
  [37.7820, -122.4080],
  [37.7900, -122.4050],
  [37.7990, -122.4040],
];

const heatColor = (l: HeatZone["level"]) =>
  l === "high" ? "#ff3b5c" : l === "medium" ? "#facc15" : "#22d39a";

const signalColor = (s: SignalStatus) =>
  s === "GREEN" ? "#22d39a" : s === "RED" ? "#ff3b5c" : "#facc15";

function PulseCircle({ z }: { z: HeatZone }) {
  const [r, setR] = useState(z.radius);
  useEffect(() => {
    if (z.level !== "high") return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.04;
      setR(z.radius + Math.sin(t) * 60);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [z.level, z.radius]);
  return (
    <Circle
      center={z.pos}
      radius={r}
      pathOptions={{
        color: heatColor(z.level),
        fillColor: heatColor(z.level),
        fillOpacity: z.level === "high" ? 0.28 : z.level === "medium" ? 0.2 : 0.14,
        weight: 1.5,
        opacity: 0.7,
      }}
    />
  );
}

function SignalDot({ s, onSelect }: { s: Signal; onSelect: (s: Signal) => void }) {
  return (
    <CircleMarker
      center={s.pos}
      radius={9}
      pathOptions={{
        color: signalColor(s.status),
        fillColor: signalColor(s.status),
        fillOpacity: 0.9,
        weight: 2,
      }}
      eventHandlers={{ click: () => onSelect(s) }}
    >
      <Popup className="sentra-popup">
        <div className="min-w-[220px] font-sans">
          <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300">{s.id}</div>
          <div className="text-base font-bold text-white">{s.name}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span
              className="px-2 py-0.5 rounded font-mono"
              style={{ background: signalColor(s.status), color: "#0a0a14" }}
            >
              {s.status}
            </span>
            <span className="text-white/70 font-mono">⏱ {s.countdown}s</span>
          </div>
          <div className="mt-2 text-xs text-white/80">
            <div>Lane density: <span className="text-cyan-300 font-mono">{s.density}%</span></div>
            <div>Congestion: <span className="font-mono">{s.congestion}</span></div>
            <div>Timing: <span className="font-mono text-white/70">{s.timing}</span></div>
          </div>
          <div className="mt-2 p-2 rounded bg-cyan-400/10 border border-cyan-400/30 text-[11px] text-cyan-100">
            <span className="text-lime-300 font-bold">AI ▸ </span>{s.ai}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

const ambulanceIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:26px;height:26px;border-radius:50%;
    background:#ff3b5c;display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 0 4px rgba(255,59,92,.25),0 0 18px rgba(255,59,92,.85);
    animation:ambPulse 1.4s ease-out infinite;color:white;font-weight:700;font-size:14px;">🚑</div>
  <style>@keyframes ambPulse{0%{box-shadow:0 0 0 0 rgba(255,59,92,.7),0 0 18px rgba(255,59,92,.85)}100%{box-shadow:0 0 0 18px rgba(255,59,92,0),0 0 18px rgba(255,59,92,.85)}}</style>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function AmbulanceMarker() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const np = p + 0.012;
        if (np >= 1) {
          setIdx((i) => (i + 1) % (ambulanceRoute.length - 1));
          return 0;
        }
        return np;
      });
    }, 60);
    return () => clearInterval(id);
  }, []);

  const pos = useMemo<[number, number]>(() => {
    const a = ambulanceRoute[idx];
    const b = ambulanceRoute[idx + 1] ?? ambulanceRoute[0];
    return [a[0] + (b[0] - a[0]) * progress, a[1] + (b[1] - a[1]) * progress];
  }, [idx, progress]);

  return <Marker position={pos} icon={ambulanceIcon} />;
}

function MapInvalidate() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 200);
  }, [map]);
  return null;
}

function StatRow({
  icon: Icon,
  label,
  value,
  color = "text-neon",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <div className={`font-display text-sm ${color}`}>{value}</div>
    </div>
  );
}

export function SmartTrafficMap() {
  const [signals, setSignals] = useState(initialSignals);
  const [selected, setSelected] = useState<Signal | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Tick countdowns / cycle status
  useEffect(() => {
    const id = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => {
          let cd = s.countdown - 1;
          let st = s.status;
          if (cd <= 0) {
            st = s.status === "GREEN" ? "YELLOW" : s.status === "YELLOW" ? "RED" : "GREEN";
            cd = st === "GREEN" ? 35 : st === "RED" ? 30 : 4;
          }
          return { ...s, countdown: cd, status: st };
        }),
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const highCount = heatZones.filter((z) => z.level === "high").length;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-4">
      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative rounded-xl overflow-hidden glass holo-border"
        style={{ height: "calc(100vh - 180px)", minHeight: 520 }}
      >
        {!loaded && (
          <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center bg-background/80 backdrop-blur">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-t-primary border-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-neon">
              Initializing Grid
            </div>
          </div>
        )}

        {/* Top overlay HUD */}
        <div className="pointer-events-none absolute top-3 left-3 right-3 z-[400] flex justify-between items-start">
          <div className="glass rounded-lg px-3 py-2 text-xs pointer-events-auto">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sector</div>
            <div className="font-display text-sm text-neon">SF-DOWNTOWN-A1</div>
          </div>
          <div className="glass rounded-lg px-3 py-2 text-xs flex items-center gap-2 pointer-events-auto">
            <span className="pulse-dot" />
            <span className="text-lime-glow font-mono">LIVE GRID</span>
          </div>
        </div>

        {/* Bottom legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] glass rounded-lg px-3 py-2 text-[11px] flex items-center gap-3">
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#22d39a] shadow-[0_0_8px_#22d39a]" /> Low</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#facc15] shadow-[0_0_8px_#facc15]" /> Medium</div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff3b5c] shadow-[0_0_8px_#ff3b5c]" /> Heavy</div>
        </div>

        <MapContainer
          center={CENTER}
          zoom={13}
          scrollWheelZoom
          zoomControl={false}
          className="h-full w-full sentra-map"
        >
          <MapInvalidate />
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {heatZones.map((z) => (
            <PulseCircle key={z.id} z={z} />
          ))}

          {/* Emergency corridor — outer glow */}
          <Polyline
            positions={ambulanceRoute}
            pathOptions={{ color: "#22d39a", weight: 10, opacity: 0.18 }}
          />
          <Polyline
            positions={ambulanceRoute}
            pathOptions={{
              color: "#22d39a",
              weight: 3,
              opacity: 0.95,
              dashArray: "8 10",
              className: "amb-route",
            }}
          />

          <AmbulanceMarker />

          {signals.map((s) => (
            <SignalDot key={s.id} s={s} onSelect={setSelected} />
          ))}
        </MapContainer>
      </motion.div>

      {/* Side analytics panel */}
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="glass holo-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Congestion Index</div>
              <div className="font-display text-3xl text-neon mt-1">73<span className="text-base text-muted-foreground">/100</span></div>
            </div>
            <Gauge className="h-7 w-7 text-primary" />
          </div>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "73%" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#22d39a] via-[#facc15] to-[#ff3b5c]"
            />
          </div>
        </div>

        <div className="glass rounded-xl p-4 space-y-2">
          <div className="font-display text-sm flex items-center gap-2 mb-1">
            <Radio className="h-4 w-4 text-primary" /> Live Stats
          </div>
          <StatRow icon={TrafficCone} label="Active Signals" value={`${signals.length}`} />
          <StatRow icon={AlertTriangle} label="High Congestion" value={`${highCount}`} color="text-[var(--color-danger)]" />
          <StatRow icon={Siren} label="Emergency Alerts" value="3" color="text-[var(--color-danger)]" />
          <StatRow icon={Activity} label="Vehicles Tracked" value="14,238" />
          <StatRow icon={Zap} label="Avg Speed" value="34 km/h" color="text-lime-glow" />
        </div>

        <div className="glass holo-border rounded-xl p-4">
          <div className="font-display text-sm flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-accent" /> AI Recommendations
          </div>
          <ul className="space-y-2 text-xs">
            {[
              "Pre-empt SIG-04 for AMB-091 in 38s",
              "Extend green at Market & 5th (+12s)",
              "Reroute traffic from Mission via Howard",
              "Increase cycle on Embarcadero corridor",
            ].map((tip, i) => (
              <motion.li
                key={tip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2 flex gap-2"
              >
                <span className="text-lime-glow font-mono">▸</span>
                <span className="text-foreground/90">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass holo-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{selected.id}</div>
                  <div className="font-display text-base">{selected.name}</div>
                </div>
                <span
                  className="px-2 py-0.5 rounded font-mono text-xs"
                  style={{ background: signalColor(selected.status), color: "#0a0a14" }}
                >
                  {selected.status} · {selected.countdown}s
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{selected.timing}</div>
              <div className="mt-2 p-2 rounded bg-primary/10 border border-primary/30 text-[11px]">
                <span className="text-lime-glow font-bold">AI ▸ </span>{selected.ai}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  );
}

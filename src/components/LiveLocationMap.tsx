import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Recenter({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
    setTimeout(() => map.invalidateSize(), 100);
  }, [map, position]);
  return null;
}

export function LiveLocationMap() {
  // Default: New Delhi
  const [pos, setPos] = useState<[number, number]>([28.6139, 77.209]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "live" | "denied">("locating");

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("denied");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos([p.coords.latitude, p.coords.longitude]);
        setAccuracy(p.coords.accuracy);
        setStatus("live");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={pos}
        zoom={14}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%", background: "oklch(0.12 0.03 245)" }}
        className="sentra-map"
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <Recenter position={pos} />

        {accuracy && (
          <CircleMarker
            center={pos}
            radius={Math.min(60, Math.max(20, accuracy / 4))}
            pathOptions={{ color: "oklch(0.85 0.18 195)", fillColor: "oklch(0.85 0.18 195)", fillOpacity: 0.08, weight: 1 }}
          />
        )}
        <CircleMarker
          center={pos}
          radius={8}
          pathOptions={{ color: "oklch(0.85 0.22 140)", fillColor: "oklch(0.85 0.22 140)", fillOpacity: 1, weight: 2 }}
        >
          <Popup>
            <div className="text-xs">
              <div className="font-mono text-[10px] opacity-70">YOUR POSITION</div>
              <div>{pos[0].toFixed(4)}, {pos[1].toFixed(4)}</div>
            </div>
          </Popup>
        </CircleMarker>
      </MapContainer>

      <div className="absolute top-2 left-2 z-[400] rounded-md bg-background/70 backdrop-blur px-2.5 py-1 border border-primary/40 text-[10px] font-mono text-primary flex items-center gap-1.5">
        <span className="pulse-dot" />
        {status === "live" ? "LIVE LOCATION" : status === "denied" ? "DEFAULT VIEW" : "LOCATING…"}
      </div>
      <div className="absolute bottom-2 right-2 z-[400] rounded-md bg-background/70 backdrop-blur px-2 py-0.5 border border-border text-[9px] font-mono text-muted-foreground">
        © OpenStreetMap · Carto
      </div>
    </div>
  );
}

export default LiveLocationMap;
// silence unused L import in some bundlers
void L;

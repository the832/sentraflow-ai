import logo from "@/assets/sentraflow-logo.png";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo} alt="SentraFlow" className={`${className} object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]`} />
      <span className="font-display text-lg font-bold tracking-wider">
        <span className="text-neon">Sentra</span>
        <span className="text-lime-glow">Flow</span>
      </span>
    </div>
  );
}

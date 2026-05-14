import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 marquee-grid opacity-40" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[var(--color-neon)] opacity-[0.08] blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--color-lime)] opacity-[0.07] blur-[140px]" />
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[var(--color-neon)]"
          initial={{ x: Math.random() * 1200, y: Math.random() * 800, opacity: 0 }}
          animate={{ y: [null, -800], opacity: [0, 0.8, 0] }}
          transition={{ duration: 8 + Math.random() * 8, repeat: Infinity, delay: Math.random() * 5 }}
          style={{ left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
}

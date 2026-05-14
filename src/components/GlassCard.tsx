import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { glow?: "cyan" | "lime" | "none" };

export function GlassCard({ className, glow = "none", children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "glass holo-border rounded-xl p-5 relative overflow-hidden",
        glow === "cyan" && "glow-cyan",
        glow === "lime" && "glow-lime glass-lime",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

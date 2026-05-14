import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { GlassCard } from "@/components/GlassCard";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · SentraFlow" },
      { name: "description", content: "Get in touch with the SentraFlow team to deploy AI traffic intelligence in your city." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-primary">Talk to Us</div>
          <h1 className="font-display text-4xl md:text-5xl mt-2">Deploy SentraFlow in your city</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Tell us about your municipality. We'll respond within 24 hours.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { i: Mail, l: "Email", v: "hello@sentraflow.ai" },
            { i: Phone, l: "Phone", v: "+1 (555) 010-2042" },
            { i: MapPin, l: "HQ", v: "Sector 7, Downtown" },
          ].map((c) => (
            <GlassCard key={c.l} className="text-center">
              <c.i className="mx-auto h-6 w-6 text-primary" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{c.l}</div>
              <div className="font-display text-foreground mt-1">{c.v}</div>
            </GlassCard>
          ))}
        </div>

        <GlassCard glow="cyan" className="mt-6">
          <form className="grid md:grid-cols-2 gap-4">
            <input className="bg-secondary/40 border border-border rounded-md p-3 text-sm" placeholder="Full Name" />
            <input className="bg-secondary/40 border border-border rounded-md p-3 text-sm" placeholder="City / Organization" />
            <input className="bg-secondary/40 border border-border rounded-md p-3 text-sm md:col-span-2" placeholder="Email" />
            <textarea className="bg-secondary/40 border border-border rounded-md p-3 text-sm md:col-span-2 min-h-32" placeholder="Tell us about your traffic challenges..." />
            <div className="md:col-span-2 flex justify-end">
              <Button type="button" className="bg-primary text-primary-foreground glow-cyan">Send Message</Button>
            </div>
          </form>
        </GlassCard>
      </section>
    </div>
  );
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { useContacts } from "@/lib/content";

export function ContactPage() {
  const c = useContacts();
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/20 to-amber-soft/20 overflow-x-hidden">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10 relative">
        <div aria-hidden className="absolute top-20 left-1/4 size-96 bg-emerald-200/30 blur-3xl rounded-full animate-blob -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Reveal variant="fade"><p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Get in Touch</p></Reveal>
            <Reveal variant="up" delay={100}><h1 className="text-5xl lg:text-6xl font-serif italic mb-4">Let's plan your <span className="text-shine">celebration</span>.</h1></Reveal>
            <Reveal variant="up" delay={200}><p className="text-lg text-muted-foreground">We respond fastest on WhatsApp — usually within an hour during business days.</p></Reveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <Reveal variant="left">
              <a href={c.WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group block p-8 rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 shine-overlay h-full">
                <MessageCircle className="size-10 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                <h2 className="text-2xl font-serif italic mb-2">WhatsApp Chat</h2>
                <p className="opacity-90 mb-4">Fastest way to reach us — share your event details and get a quote.</p>
                <span className="inline-flex items-center gap-2 font-semibold">+91 {c.PHONE} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
              </a>
            </Reveal>
            <Reveal variant="right">
              <a href={c.TEL_URL} className="group block p-8 rounded-3xl bg-foreground text-background shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 shine-overlay h-full">
                <Phone className="size-10 mb-4 text-marigold group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
                <h2 className="text-2xl font-serif italic mb-2">Call Us</h2>
                <p className="opacity-80 mb-4">Prefer to talk? We're a phone call away during business hours.</p>
                <span className="inline-flex items-center gap-2 font-semibold text-marigold">+91 {c.PHONE} <span className="group-hover:translate-x-1 transition-transform">→</span></span>
              </a>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { Icon: MapPin, label: "Studio", value: c.address },
              { Icon: Clock, label: "Hours", value: c.hours },
              { Icon: Mail, label: "Email", value: c.email },
            ].map((item, i) => (
              <Reveal key={item.label} variant="up" delay={i * 100}>
                <div className="p-6 rounded-2xl bg-card border border-border card-hover h-full">
                  <item.Icon className="size-6 text-marigold mb-3" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-medium">{item.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up">
            <div className="rounded-[2rem] overflow-hidden border border-border shadow-2xl">
              <div className="aspect-[16/9] bg-muted">
                <iframe
                  src={c.mapsEmbed}
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Studio location"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-card">
                <div>
                  <p className="font-serif italic text-xl">Visit our studio</p>
                  <p className="text-sm text-muted-foreground">{c.address}</p>
                </div>
                <a href={c.mapsLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-marigold text-primary-foreground rounded-full text-sm font-semibold hover:scale-105 hover:shadow-xl transition-all duration-500 shine-overlay">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

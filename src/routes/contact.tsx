import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";
import { PHONE, TEL_URL, WHATSAPP_URL, MAPS_EMBED, MAPS_LINK, LOCATION } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Varna Utsav Anantapur | Call or WhatsApp" },
      { name: "description", content: "Reach Varna Utsav in Anantapur. Call +91 6302024335, WhatsApp us, or visit our studio. Free consultation for all events." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/20 to-amber-soft/20">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Get in Touch</p>
            <h1 className="text-5xl lg:text-6xl font-serif italic mb-4">Let's plan your celebration.</h1>
            <p className="text-lg text-muted-foreground">
              We respond fastest on WhatsApp — usually within an hour during business days.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group p-8 rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:-translate-y-1 transition-transform">
              <MessageCircle className="size-10 mb-4" />
              <h2 className="text-2xl font-serif italic mb-2">WhatsApp Chat</h2>
              <p className="opacity-90 mb-4">Fastest way to reach us — share your event details and get a quote.</p>
              <span className="inline-flex items-center gap-2 font-semibold">+91 {PHONE} →</span>
            </a>
            <a href={TEL_URL} className="group p-8 rounded-3xl bg-foreground text-background shadow-xl hover:-translate-y-1 transition-transform">
              <Phone className="size-10 mb-4 text-marigold" />
              <h2 className="text-2xl font-serif italic mb-2">Call Us</h2>
              <p className="opacity-80 mb-4">Prefer to talk? We're a phone call away during business hours.</p>
              <span className="inline-flex items-center gap-2 font-semibold text-marigold">+91 {PHONE} →</span>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <MapPin className="size-6 text-marigold mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Studio</p>
              <p className="font-medium">{LOCATION}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <Clock className="size-6 text-marigold mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Hours</p>
              <p className="font-medium">Mon – Sun · 9 AM – 9 PM</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <Mail className="size-6 text-marigold mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</p>
              <p className="font-medium">hello@varnautsav.in</p>
            </div>
          </div>

          <div className="rounded-[2rem] overflow-hidden border border-border shadow-2xl">
            <div className="aspect-[16/9] bg-muted">
              <iframe
                src={MAPS_EMBED}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Varna Utsav location in Anantapur"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-card">
              <div>
                <p className="font-serif italic text-xl">Visit our studio</p>
                <p className="text-sm text-muted-foreground">{LOCATION}</p>
              </div>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-marigold text-primary-foreground rounded-full text-sm font-semibold hover:scale-105 transition-transform">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

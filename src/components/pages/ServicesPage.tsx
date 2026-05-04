import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import { Check } from "lucide-react";
import { useContacts, useContent } from "@/lib/content";

const includes = ["Site visit & consultation", "Custom theme design", "Setup & dismantling", "Dedicated coordinator"];

export function ServicesPage() {
  const { content } = useContent();
  const { WHATSAPP_URL } = useContacts();
  const services = content.services;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-amber-soft/20 to-rose-soft/20 overflow-x-hidden">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10 relative">
        <div aria-hidden className="absolute top-10 right-10 size-80 bg-marigold/20 blur-3xl rounded-full animate-blob -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal variant="fade"><p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Pricing & Packages</p></Reveal>
            <Reveal variant="up" delay={100}><h1 className="text-5xl lg:text-6xl font-serif italic mb-6">Every event, <span className="text-shine">beautifully</span> done.</h1></Reveal>
            <Reveal variant="up" delay={200}><p className="text-lg text-muted-foreground">Starting prices reflect our standard packages — every quote is fully customizable based on venue, guest count and theme.</p></Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.id} variant="up" delay={i * 80}>
                <article className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden card-hover h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-muted shine-overlay">
                    <img src={s.image} alt={s.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-serif italic mb-2 group-hover:text-marigold transition-colors">{s.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.description}</p>
                    <ul className="space-y-1.5 mb-5">
                      {includes.map((inc) => (
                        <li key={inc} className="flex items-center gap-2 text-xs text-foreground/70">
                          <Check className="size-3.5 text-marigold shrink-0" /> {inc}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-end justify-between pt-4 border-t border-border">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground">Starting at</span>
                        <span className="text-2xl font-serif text-marigold tabular-nums">{s.price}</span>
                      </div>
                      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-foreground text-background rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-marigold hover:scale-105 transition-all duration-500">
                        Inquire
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

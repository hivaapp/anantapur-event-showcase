import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { services } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/contact";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services & Pricing — Varna Utsav Anantapur" },
      { name: "description", content: "Wedding, engagement, haldi, birthday, cradle and corporate event decoration services in Anantapur. Transparent starting prices." },
    ],
  }),
  component: Services,
});

const includes = ["Site visit & consultation", "Custom theme design", "Setup & dismantling", "Dedicated coordinator"];

function Services() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-amber-soft/20 to-rose-soft/20">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Pricing & Packages</p>
            <h1 className="text-5xl lg:text-6xl font-serif italic mb-6">Every event, beautifully done.</h1>
            <p className="text-lg text-muted-foreground">
              Starting prices reflect our standard packages — every quote is fully customizable
              based on venue, guest count and theme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <article key={s.title} className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-marigold/10 hover:-translate-y-1 transition-all duration-500" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={s.image} alt={s.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-2xl font-serif italic mb-2">{s.title}</h2>
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
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-foreground text-background rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-marigold transition-colors">
                      Inquire
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

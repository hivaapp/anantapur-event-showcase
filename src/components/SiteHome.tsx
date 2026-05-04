import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useContacts, useContent } from "@/lib/content";
import { SectionLink } from "@/lib/siteContext";

const ICONS = { Heart, Sparkles, Award } as const;

export function SiteHome() {
  const { content } = useContent();
  const { WHATSAPP_URL } = useContacts();
  const { hero, features, services, faqs, cta } = content;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/20 to-sky-soft/20 overflow-x-hidden">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-6 lg:px-10">
          <div aria-hidden className="absolute -top-32 -left-20 size-[28rem] bg-gradient-to-tr from-marigold/30 via-rose-soft/40 to-amber-soft/40 blur-3xl animate-blob -z-10" />
          <div aria-hidden className="absolute top-1/3 -right-32 size-[32rem] bg-gradient-to-bl from-sky-soft/40 via-rose-soft/30 to-marigold/20 blur-3xl animate-blob -z-10" style={{ animationDelay: "4s" }} />

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-7 z-10">
              <Reveal variant="fade">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-marigold/10 border border-marigold/20 rounded-full text-marigold text-xs font-bold uppercase tracking-widest animate-pulse-slow">
                  <Sparkles className="size-3.5 animate-shimmer" /> {hero.badge}
                </div>
              </Reveal>
              <Reveal variant="up" delay={120}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif italic leading-[1.05] text-balance">
                  {hero.headingPre}<span className="text-shine">{hero.headingHighlight}</span>{hero.headingPost}
                </h1>
              </Reveal>
              <Reveal variant="up" delay={220}>
                <p className="max-w-[50ch] text-lg text-muted-foreground leading-relaxed">{hero.subheading}</p>
              </Reveal>
              <Reveal variant="up" delay={320}>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group/cta relative inline-flex items-center gap-2 px-7 py-4 bg-marigold text-primary-foreground rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-marigold/50 transition-all duration-500 shine-overlay">
                    {hero.ctaPrimary} <ArrowRight className="size-4 group-hover/cta:translate-x-1 transition-transform" />
                  </a>
                  <SectionLink section="gallery" className="inline-flex items-center gap-2 px-7 py-4 border border-border bg-background/60 backdrop-blur rounded-full font-semibold hover:bg-accent hover:-translate-y-1 transition-all duration-500">
                    {hero.ctaSecondary}
                  </SectionLink>
                </div>
              </Reveal>
              <Reveal variant="up" delay={420}>
                <div className="flex flex-wrap gap-8 pt-6 text-sm">
                  {hero.stats.map((s) => (
                    <div key={s.id} className="group/stat">
                      <span className="block text-2xl font-serif text-marigold transition-transform duration-500 group-hover/stat:scale-110">{s.n}</span>
                      <span className="text-muted-foreground">{s.l}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal variant="scale" delay={200} className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative animate-tilt">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-700">
                  <img src={hero.image} alt={`${content.brand.name} hero`} className="w-full h-full object-cover" width={1280} height={1600} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute -top-10 -left-10 size-48 rounded-full bg-gradient-to-tr from-rose-soft/60 via-sky-soft/60 to-amber-soft/60 blur-3xl animate-float -z-10" />
                <div className="absolute -bottom-12 -right-12 size-60 rounded-full bg-gradient-to-bl from-amber-soft/50 via-rose-soft/50 to-sky-soft/50 blur-3xl animate-float-slow -z-10" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Sparkles;
              return (
                <Reveal key={f.id} variant="up" delay={i * 120}>
                  <div className="group p-8 rounded-3xl bg-card border border-border card-hover shine-overlay">
                    <div className="size-14 rounded-2xl bg-marigold/10 flex items-center justify-center mb-5 group-hover:bg-marigold group-hover:rotate-6 transition-all duration-500">
                      <Icon className="size-7 text-marigold group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-serif mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <Reveal variant="left">
                <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-2">What We Offer</p>
                <h2 className="text-4xl lg:text-5xl font-serif italic">Curated Collections</h2>
              </Reveal>
              <Reveal variant="right">
                <SectionLink section="services" className="group text-sm font-semibold text-marigold inline-flex items-center gap-2 underline-grow">
                  View all <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </SectionLink>
              </Reveal>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} variant="up" delay={i * 90}>
                  <div className="group p-6 bg-card/60 backdrop-blur border border-border rounded-3xl card-hover h-full">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-5 bg-muted shine-overlay">
                      <img src={s.image} alt={s.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    </div>
                    <h3 className="text-xl font-serif italic mb-2 group-hover:text-marigold transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starting at</span>
                      <span className="text-lg font-medium tabular-nums text-marigold">{s.price}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <TestimonialsSection />

        {/* FAQ */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-4xl mx-auto">
            <Reveal variant="up" className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-2">Questions</p>
              <h2 className="text-4xl lg:text-5xl font-serif italic">Frequently Asked</h2>
              <p className="mt-4 text-muted-foreground">Quick answers — or chat with us directly on WhatsApp.</p>
            </Reveal>

            <Reveal variant="up" delay={120}>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.id} value={`item-${i}`} className="border border-border rounded-2xl bg-card/60 backdrop-blur px-5 data-[state=open]:shadow-xl data-[state=open]:shadow-marigold/10 data-[state=open]:border-marigold/40 transition-all duration-500">
                    <AccordionTrigger className="text-left font-serif text-lg hover:no-underline py-5 hover:text-marigold transition-colors">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-10">
          <Reveal variant="scale">
            <div className="max-w-5xl mx-auto p-10 lg:p-16 rounded-[2.5rem] text-white text-center shadow-2xl shadow-marigold/30 relative overflow-hidden"
              style={{
                background: "linear-gradient(120deg, var(--marigold), oklch(0.72 0.2 30), oklch(0.78 0.15 70), var(--marigold))",
                backgroundSize: "300% 300%",
                animation: "gradient-pan 10s ease infinite",
              }}
            >
              <div aria-hidden className="absolute inset-0 -z-0">
                <div className="absolute top-0 left-1/4 size-40 bg-white/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 size-52 bg-white/10 rounded-full blur-3xl animate-float-slow" />
              </div>
              <div className="relative">
                <h2 className="text-4xl lg:text-5xl font-serif italic mb-4">{cta.heading}</h2>
                <p className="max-w-xl mx-auto mb-8 opacity-90">{cta.subheading}</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-marigold rounded-full font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-500 shine-overlay">Chat on WhatsApp</a>
                  <SectionLink section="contact" className="px-8 py-4 border border-white/40 backdrop-blur rounded-full font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-500">Contact</SectionLink>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

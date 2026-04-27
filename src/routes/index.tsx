import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Heart, Award } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { services } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/contact";
import heroImg from "@/assets/hero-wedding.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varna Utsav — Event Decorators in Anantapur" },
      { name: "description", content: "Premier event decoration in Anantapur. Weddings, birthdays, haldi, cradle ceremonies & more. Get a quote on WhatsApp today." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/20 to-sky-soft/20">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 space-y-7 z-10 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-marigold/10 border border-marigold/20 rounded-full text-marigold text-xs font-bold uppercase tracking-widest">
                <Sparkles className="size-3.5" /> Premier Decor in Anantapur
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif italic leading-[1.05] text-balance">
                Crafting <span className="text-marigold">Sunlit</span> Celebrations.
              </h1>
              <p className="max-w-[50ch] text-lg text-muted-foreground leading-relaxed">
                We transform your most cherished milestones into ethereal landscapes of marigold,
                silk, and iridescent light — for weddings, functions and every joyful occasion.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 bg-marigold text-primary-foreground rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 transition-transform"
                >
                  Get a Free Quote <ArrowRight className="size-4" />
                </a>
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-border bg-background/60 backdrop-blur rounded-full font-semibold hover:bg-accent transition-colors"
                >
                  View Gallery
                </Link>
              </div>
              <div className="flex flex-wrap gap-8 pt-6 text-sm">
                <div><span className="block text-2xl font-serif text-marigold">500+</span><span className="text-muted-foreground">Events</span></div>
                <div><span className="block text-2xl font-serif text-marigold">8+</span><span className="text-muted-foreground">Years</span></div>
                <div><span className="block text-2xl font-serif text-marigold">100%</span><span className="text-muted-foreground">Custom</span></div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img src={heroImg} alt="Luxury wedding decoration" className="w-full h-full object-cover" width={1280} height={1600} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -top-10 -left-10 size-48 rounded-full bg-gradient-to-tr from-rose-soft/60 via-sky-soft/60 to-amber-soft/60 blur-3xl animate-float -z-10" />
              <div className="absolute -bottom-12 -right-12 size-60 rounded-full bg-gradient-to-bl from-amber-soft/50 via-rose-soft/50 to-sky-soft/50 blur-3xl animate-float -z-10" style={{ animationDelay: "2s" }} />
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Crafted with Devotion", text: "Every garland, every drape — handpicked and arranged with love by our local artisans." },
              { icon: Sparkles, title: "Bespoke Themes", text: "From traditional South Indian to modern pastel — we design around your story." },
              { icon: Award, title: "Trusted in Anantapur", text: "Hundreds of families have entrusted us with their most precious moments." },
            ].map((f) => (
              <div key={f.title} className="p-8 rounded-3xl bg-card border border-border hover:shadow-xl hover:shadow-marigold/10 transition-all duration-500">
                <f.icon className="size-8 text-marigold mb-4" />
                <h3 className="text-xl font-serif mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-2">What We Do</p>
                <h2 className="text-4xl lg:text-5xl font-serif italic">Curated Collections</h2>
              </div>
              <Link to="/services" className="text-sm font-semibold text-marigold hover:underline inline-flex items-center gap-2">
                View all services <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((s) => (
                <div key={s.title} className="group p-6 bg-card/60 backdrop-blur border border-border rounded-3xl hover:shadow-2xl hover:shadow-marigold/10 hover:-translate-y-1 transition-all duration-500">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-5 bg-muted">
                    <img src={s.image} alt={s.title} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xl font-serif italic mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starting at</span>
                    <span className="text-lg font-medium tabular-nums text-marigold">{s.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto p-10 lg:p-16 rounded-[2.5rem] bg-gradient-to-br from-marigold via-amber-500 to-rose-400 text-white text-center shadow-2xl shadow-marigold/30">
            <h2 className="text-4xl lg:text-5xl font-serif italic mb-4">Ready to celebrate?</h2>
            <p className="max-w-xl mx-auto mb-8 opacity-90">
              Tell us about your event — we'll send you a free customized quote on WhatsApp within hours.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white text-marigold rounded-full font-semibold hover:scale-105 transition-transform">Chat on WhatsApp</a>
              <Link to="/contact" className="px-8 py-4 border border-white/40 backdrop-blur rounded-full font-semibold hover:bg-white/10 transition-colors">Visit Studio</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import heroImg from "@/assets/hero-wedding.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Varna Utsav | Event Decorators in Anantapur" },
      { name: "description", content: "Meet Varna Utsav — Anantapur's trusted event decoration studio crafting bespoke weddings & functions for over 8 years." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-amber-soft/20 to-sky-soft/20 overflow-x-hidden">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10 relative">
        <div aria-hidden className="absolute top-40 -right-20 size-96 bg-marigold/20 blur-3xl rounded-full animate-blob -z-10" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <Reveal variant="left">
              <div className="relative animate-tilt">
                <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-700">
                  <img src={heroImg} alt="Our work" width={1280} height={1600} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-8 -right-8 size-48 rounded-full bg-gradient-to-tr from-marigold/40 via-rose-soft/60 to-amber-soft/60 blur-3xl animate-float -z-10" />
              </div>
            </Reveal>
            <div className="space-y-6">
              <Reveal variant="right" delay={100}><p className="text-xs uppercase tracking-widest text-marigold font-bold">Our Story</p></Reveal>
              <Reveal variant="right" delay={180}><h1 className="text-5xl font-serif italic leading-tight">Born in Anantapur, built on <span className="text-shine">tradition</span>.</h1></Reveal>
              <Reveal variant="right" delay={260}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Varna Utsav began as a small family workshop weaving marigold garlands for
                  neighborhood weddings. Today, we're Anantapur's most trusted event decoration
                  studio — but our heart hasn't changed.
                </p>
              </Reveal>
              <Reveal variant="right" delay={340}>
                <p className="text-muted-foreground leading-relaxed">
                  Every celebration we touch is treated like our own family's. From the first
                  conversation to the last petal placed, we obsess over the small details that
                  make your day unforgettable.
                </p>
              </Reveal>
              <Reveal variant="up" delay={420}>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { n: "500+", l: "Events" },
                    { n: "8+", l: "Years" },
                    { n: "25+", l: "Artisans" },
                  ].map((s) => (
                    <div key={s.l} className="group/s">
                      <span className="block text-3xl font-serif text-marigold transition-transform duration-500 group-hover/s:scale-110">{s.n}</span>
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">{s.l}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "We Listen", text: "Tell us your vision, theme, budget and venue. We take notes — every wish matters." },
              { num: "02", title: "We Design", text: "Our team crafts a custom mood board, color palette and floral plan just for you." },
              { num: "03", title: "We Deliver", text: "On the big day, we set up, manage and dismantle — so you can simply enjoy." },
            ].map((step, i) => (
              <Reveal key={step.num} variant="up" delay={i * 130}>
                <div className="group p-8 rounded-3xl bg-card border border-border card-hover h-full">
                  <span className="text-5xl font-serif italic text-marigold/40 group-hover:text-marigold transition-colors duration-500">{step.num}</span>
                  <h3 className="text-xl font-serif mt-3 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
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

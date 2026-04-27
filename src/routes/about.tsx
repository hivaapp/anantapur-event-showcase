import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
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
    <div className="min-h-dvh bg-gradient-to-br from-background via-amber-soft/20 to-sky-soft/20">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 animate-fade-up">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                <img src={heroImg} alt="Our work" width={1280} height={1600} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 size-48 rounded-full bg-gradient-to-tr from-marigold/40 via-rose-soft/60 to-amber-soft/60 blur-3xl -z-10" />
            </div>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-widest text-marigold font-bold">Our Story</p>
              <h1 className="text-5xl font-serif italic leading-tight">Born in Anantapur, built on tradition.</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Varna Utsav began as a small family workshop weaving marigold garlands for
                neighborhood weddings. Today, we're Anantapur's most trusted event decoration
                studio — but our heart hasn't changed.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every celebration we touch is treated like our own family's. From the first
                conversation to the last petal placed, we obsess over the small details that
                make your day unforgettable.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div><span className="block text-3xl font-serif text-marigold">500+</span><span className="text-xs text-muted-foreground uppercase tracking-widest">Events</span></div>
                <div><span className="block text-3xl font-serif text-marigold">8+</span><span className="text-xs text-muted-foreground uppercase tracking-widest">Years</span></div>
                <div><span className="block text-3xl font-serif text-marigold">25+</span><span className="text-xs text-muted-foreground uppercase tracking-widest">Artisans</span></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "We Listen", text: "Tell us your vision, theme, budget and venue. We take notes — every wish matters." },
              { num: "02", title: "We Design", text: "Our team crafts a custom mood board, color palette and floral plan just for you." },
              { num: "03", title: "We Deliver", text: "On the big day, we set up, manage and dismantle — so you can simply enjoy." },
            ].map((step) => (
              <div key={step.num} className="p-8 rounded-3xl bg-card border border-border">
                <span className="text-5xl font-serif italic text-marigold/40">{step.num}</span>
                <h3 className="text-xl font-serif mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

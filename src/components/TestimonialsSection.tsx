import { useEffect, useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const testimonials = [
  {
    name: "Lakshmi Priya",
    event: "Wedding — Anantapur",
    quote:
      "Varna Utsav turned our mandap into a dream. Every marigold, every drape was arranged with such love. Guests are still talking about the decor!",
    rating: 5,
  },
  {
    name: "Ravi Kumar",
    event: "Engagement — Hindupur",
    quote:
      "From the first WhatsApp message to the final pookalam, the team was incredible. Transparent pricing and flawless execution.",
    rating: 5,
  },
  {
    name: "Sushma Reddy",
    event: "Cradle Ceremony",
    quote:
      "They designed the cutest pastel theme for our baby's naming ceremony. Affordable, punctual, and absolutely magical.",
    rating: 5,
  },
  {
    name: "Naveen & Ashwini",
    event: "Haldi + Reception",
    quote:
      "Two events in two days — and both were perfect. Creative themes, fresh flowers, and the most caring crew in Anantapur.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const count = testimonials.length;

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count]);

  const go = (dir: number) => setIdx((i) => (i + dir + count) % count);

  return (
    <section className="py-20 px-6 lg:px-10 relative overflow-hidden">
      <div aria-hidden className="absolute top-1/2 -translate-y-1/2 -left-32 size-[28rem] bg-gradient-to-tr from-rose-soft/30 to-marigold/20 blur-3xl animate-blob -z-10" />
      <div aria-hidden className="absolute top-1/2 -translate-y-1/2 -right-32 size-[28rem] bg-gradient-to-bl from-sky-soft/30 to-amber-soft/30 blur-3xl animate-blob -z-10" style={{ animationDelay: "3s" }} />

      <div className="max-w-5xl mx-auto">
        <Reveal variant="up" className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-2">Kind Words</p>
          <h2 className="text-4xl lg:text-5xl font-serif italic">Loved by Families</h2>
        </Reveal>

        <Reveal variant="scale" delay={120}>
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem]">
              <div
                className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {testimonials.map((t) => (
                  <div key={t.name} className="min-w-full px-2 sm:px-8">
                    <div className="relative p-8 sm:p-12 rounded-[2rem] bg-card/70 backdrop-blur border border-border shadow-xl shine-overlay">
                      <Quote className="absolute top-6 right-6 size-12 text-marigold/20" />
                      <div className="flex gap-1 mb-5">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-marigold text-marigold" />
                        ))}
                      </div>
                      <p className="text-lg sm:text-xl font-serif italic leading-relaxed text-foreground/90 mb-6">
                        "{t.quote}"
                      </p>
                      <div className="pt-5 border-t border-border">
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.event}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="size-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-marigold hover:text-primary-foreground hover:border-marigold hover:-translate-y-0.5 transition-all duration-500"
              >
                <ChevronLeft className="size-5" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === idx ? "w-8 bg-marigold" : "w-2 bg-border hover:bg-marigold/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="size-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-marigold hover:text-primary-foreground hover:border-marigold hover:-translate-y-0.5 transition-all duration-500"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Reveal } from "@/components/Reveal";
import { useContacts, useContent } from "@/lib/content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Our Work | Varna Utsav Anantapur" },
      { name: "description", content: "Browse our portfolio of weddings, engagements, haldi, birthdays and corporate events decorated in Anantapur." },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { content } = useContent();
  const { WHATSAPP_URL } = useContacts();
  const items = content.gallery;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-sky-soft/20 to-rose-soft/20 overflow-x-hidden">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10 relative">
        <div aria-hidden className="absolute -top-20 left-1/4 size-96 bg-rose-soft/40 blur-3xl rounded-full animate-blob -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal variant="fade"><p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Our Portfolio</p></Reveal>
            <Reveal variant="up" delay={100}><h1 className="text-5xl lg:text-6xl font-serif italic mb-6">Moments we've <span className="text-shine">crafted</span>.</h1></Reveal>
            <Reveal variant="up" delay={200}><p className="text-lg text-muted-foreground">A glimpse into the celebrations we've had the honor of decorating across Anantapur.</p></Reveal>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {items.map((s, i) => (
              <Reveal key={s.id} variant="up" delay={(i % 6) * 70}>
                <figure className="group break-inside-avoid relative rounded-3xl overflow-hidden bg-muted shadow-lg hover:shadow-2xl hover:shadow-marigold/20 hover:-translate-y-1 transition-all duration-700 shine-overlay">
                  <img
                    src={s.image}
                    alt={s.caption}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className={`w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-serif italic text-xl">{s.caption}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal variant="scale">
            <div className="text-center mt-16">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-marigold text-primary-foreground rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 shine-overlay">
                Plan your event with us
              </a>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

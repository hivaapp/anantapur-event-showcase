import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { services } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/contact";

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
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-sky-soft/20 to-rose-soft/20">
      <Header />
      <main className="pt-12 pb-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Our Portfolio</p>
            <h1 className="text-5xl lg:text-6xl font-serif italic mb-6">Moments we've crafted.</h1>
            <p className="text-lg text-muted-foreground">
              A glimpse into the celebrations we've had the honor of decorating across Anantapur.
            </p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>*]:mb-5">
            {[...services, ...services].map((s, i) => (
              <figure key={i} className="group break-inside-avoid relative rounded-3xl overflow-hidden bg-muted shadow-lg hover:shadow-2xl hover:shadow-marigold/20 transition-all duration-500">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"}`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                  <p className="text-xs uppercase tracking-widest opacity-70">{s.price} +</p>
                  <p className="font-serif italic text-xl">{s.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="text-center mt-16">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-4 bg-marigold text-primary-foreground rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 transition-transform">
              Plan your event with us
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

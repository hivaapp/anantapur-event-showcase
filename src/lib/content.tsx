import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import wedding from "@/assets/hero-wedding.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import haldi from "@/assets/gallery-haldi.jpg";
import cradle from "@/assets/gallery-cradle.jpg";
import engagement from "@/assets/gallery-engagement.jpg";
import mandap from "@/assets/gallery-mandap.jpg";
import corporate from "@/assets/gallery-corporate.jpg";

export type ServiceItem = {
  id: string;
  title: string;
  image: string;
  description: string;
  price: string;
};

export type GalleryItem = { id: string; image: string; caption: string };
export type Testimonial = { id: string; name: string; event: string; quote: string; rating: number };
export type Faq = { id: string; q: string; a: string };
export type Step = { id: string; num: string; title: string; text: string };
export type Stat = { id: string; n: string; l: string };

export type SiteContent = {
  brand: {
    name: string;
    tagline: string;
  };
  contact: {
    phone: string;
    whatsappMessage: string;
    email: string;
    address: string;
    hours: string;
    mapsEmbed: string;
    mapsLink: string;
    instagram: string;
  };
  hero: {
    badge: string;
    headingPre: string;
    headingHighlight: string;
    headingPost: string;
    subheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
    stats: Stat[];
  };
  features: { id: string; icon: "Heart" | "Sparkles" | "Award"; title: string; text: string }[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  about: {
    eyebrow: string;
    headingPre: string;
    headingHighlight: string;
    headingPost: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    stats: Stat[];
    steps: Step[];
  };
  cta: {
    heading: string;
    subheading: string;
  };
};

const uid = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "Varna Utsav",
    tagline: "Anantapur's premier event decoration studio.",
  },
  contact: {
    phone: "6302024335",
    whatsappMessage: "Hi Varna Utsav! I'd like to inquire about event decoration services.",
    email: "hello@varnautsav.in",
    address: "Anantapur, Andhra Pradesh, India",
    hours: "Mon – Sun · 9 AM – 9 PM",
    mapsEmbed: "https://www.google.com/maps?q=Anantapur,Andhra+Pradesh,India&output=embed",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Anantapur,Andhra+Pradesh",
    instagram: "https://instagram.com",
  },
  hero: {
    badge: "Premier Decor in Anantapur",
    headingPre: "Crafting ",
    headingHighlight: "Sunlit",
    headingPost: " Celebrations.",
    subheading:
      "We transform your most cherished milestones into ethereal landscapes of marigold, silk, and iridescent light — for weddings, functions and every joyful occasion.",
    ctaPrimary: "Get a Free Quote",
    ctaSecondary: "View Gallery",
    image: wedding,
    stats: [
      { id: uid(), n: "500+", l: "Events" },
      { id: uid(), n: "8+", l: "Years" },
      { id: uid(), n: "100%", l: "Custom" },
    ],
  },
  features: [
    { id: uid(), icon: "Heart", title: "Crafted with Devotion", text: "Every garland, every drape — handpicked and arranged with love by our local artisans." },
    { id: uid(), icon: "Sparkles", title: "Bespoke Themes", text: "From traditional South Indian to modern pastel — we design around your story." },
    { id: uid(), icon: "Award", title: "Trusted in Anantapur", text: "Hundreds of families have entrusted us with their most precious moments." },
  ],
  services: [
    { id: uid(), title: "Wedding Decor", image: wedding, description: "Grand floral mandaps, marigold canopies and royal stage setups for traditional South Indian weddings.", price: "₹45,000" },
    { id: uid(), title: "Engagement & Reception", image: engagement, description: "Lavish rose walls, fairy lights and golden lamps that turn your reception into a fairytale.", price: "₹35,000" },
    { id: uid(), title: "Haldi Function", image: haldi, description: "Sun-kissed marigold swings, yellow drapes and fresh flowers for your most joyful pre-wedding ritual.", price: "₹18,000" },
    { id: uid(), title: "Birthday Celebrations", image: birthday, description: "Pastel balloon arches, themed backdrops and whimsical setups for kids and adults alike.", price: "₹8,500" },
    { id: uid(), title: "Cradle & Naming Ceremony", image: cradle, description: "Soft pastel themes, delicate florals and dreamy drapes for your little one's first celebration.", price: "₹15,000" },
    { id: uid(), title: "Corporate & Functions", image: corporate, description: "Elegant stage decor, podiums and ambient lighting for conferences, launches and corporate galas.", price: "₹25,000" },
  ],
  gallery: [
    { id: uid(), image: wedding, caption: "Wedding Mandap" },
    { id: uid(), image: mandap, caption: "Floral Mandap" },
    { id: uid(), image: engagement, caption: "Engagement Stage" },
    { id: uid(), image: haldi, caption: "Haldi Setup" },
    { id: uid(), image: cradle, caption: "Cradle Ceremony" },
    { id: uid(), image: birthday, caption: "Birthday Theme" },
    { id: uid(), image: corporate, caption: "Corporate Gala" },
  ],
  testimonials: [
    { id: uid(), name: "Lakshmi Priya", event: "Wedding — Anantapur", quote: "Varna Utsav turned our mandap into a dream. Every marigold, every drape was arranged with such love. Guests are still talking about the decor!", rating: 5 },
    { id: uid(), name: "Ravi Kumar", event: "Engagement — Hindupur", quote: "From the first WhatsApp message to the final pookalam, the team was incredible. Transparent pricing and flawless execution.", rating: 5 },
    { id: uid(), name: "Sushma Reddy", event: "Cradle Ceremony", quote: "They designed the cutest pastel theme for our baby's naming ceremony. Affordable, punctual, and absolutely magical.", rating: 5 },
    { id: uid(), name: "Naveen & Ashwini", event: "Haldi + Reception", quote: "Two events in two days — and both were perfect. Creative themes, fresh flowers, and the most caring crew in Anantapur.", rating: 5 },
  ],
  faqs: [
    { id: uid(), q: "Which areas do you serve?", a: "We are based in Anantapur and regularly decorate events across Hindupur, Tadipatri, Dharmavaram, Kadiri, and nearby towns in the Rayalaseema region." },
    { id: uid(), q: "How early should I book?", a: "For weddings we recommend booking 4–8 weeks in advance. For smaller functions like birthdays, haldi, or cradle ceremonies, 1–2 weeks is usually enough." },
    { id: uid(), q: "Do you offer customized themes?", a: "Absolutely. Every event is designed around your story — traditional South Indian, pastel modern, floral minimalist, or a theme of your choice. Send us inspiration on WhatsApp and we'll curate a moodboard." },
    { id: uid(), q: "What does the starting price include?", a: "Starting prices cover stage decor, entrance arch, and essential floral arrangements for a standard venue. Final quotes depend on venue size, flower selection, and theme complexity." },
    { id: uid(), q: "How do I get a quote?", a: "The fastest way is WhatsApp — share your date, venue, and a reference image. We'll reply with a free customized quote within a few hours." },
  ],
  about: {
    eyebrow: "Our Story",
    headingPre: "Born in Anantapur, built on ",
    headingHighlight: "tradition",
    headingPost: ".",
    paragraph1: "Varna Utsav began as a small family workshop weaving marigold garlands for neighborhood weddings. Today, we're Anantapur's most trusted event decoration studio — but our heart hasn't changed.",
    paragraph2: "Every celebration we touch is treated like our own family's. From the first conversation to the last petal placed, we obsess over the small details that make your day unforgettable.",
    image: wedding,
    stats: [
      { id: uid(), n: "500+", l: "Events" },
      { id: uid(), n: "8+", l: "Years" },
      { id: uid(), n: "25+", l: "Artisans" },
    ],
    steps: [
      { id: uid(), num: "01", title: "We Listen", text: "Tell us your vision, theme, budget and venue. We take notes — every wish matters." },
      { id: uid(), num: "02", title: "We Design", text: "Our team crafts a custom mood board, color palette and floral plan just for you." },
      { id: uid(), num: "03", title: "We Deliver", text: "On the big day, we set up, manage and dismantle — so you can simply enjoy." },
    ],
  },
  cta: {
    heading: "Ready to celebrate?",
    subheading: "Tell us about your event — we'll send you a free customized quote on WhatsApp within hours.",
  },
};

const STORAGE_KEY = "varna_utsav_content_v1";

type Ctx = {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  reset: () => void;
};

const ContentCtx = createContext<Ctx | null>(null);

function mergeWithDefaults(stored: any): SiteContent {
  // Shallow-merge so newly added fields fall back to defaults
  if (!stored || typeof stored !== "object") return DEFAULT_CONTENT;
  return {
    ...DEFAULT_CONTENT,
    ...stored,
    brand: { ...DEFAULT_CONTENT.brand, ...(stored.brand || {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(stored.contact || {}) },
    hero: { ...DEFAULT_CONTENT.hero, ...(stored.hero || {}) },
    about: { ...DEFAULT_CONTENT.about, ...(stored.about || {}) },
    cta: { ...DEFAULT_CONTENT.cta, ...(stored.cta || {}) },
    features: stored.features?.length ? stored.features : DEFAULT_CONTENT.features,
    services: stored.services?.length ? stored.services : DEFAULT_CONTENT.services,
    gallery: stored.gallery?.length ? stored.gallery : DEFAULT_CONTENT.gallery,
    testimonials: stored.testimonials?.length ? stored.testimonials : DEFAULT_CONTENT.testimonials,
    faqs: stored.faqs?.length ? stored.faqs : DEFAULT_CONTENT.faqs,
  };
}

export function ContentProvider({
  children,
  override,
  readOnly,
}: {
  children: ReactNode;
  override?: SiteContent | null;
  readOnly?: boolean;
}) {
  const [content, setContentState] = useState<SiteContent>(override ?? DEFAULT_CONTENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (override) {
      setContentState(override);
      setHydrated(true);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setContentState(mergeWithDefaults(JSON.parse(raw)));
    } catch {}
    setHydrated(true);
  }, [override]);

  const setContent = (c: SiteContent) => {
    setContentState(c);
    if (readOnly || override) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {}
  };

  const reset = () => {
    if (readOnly || override) {
      setContentState(override ?? DEFAULT_CONTENT);
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setContentState(DEFAULT_CONTENT);
  };

  return (
    <ContentCtx.Provider value={{ content, setContent, reset }}>
      {hydrated ? children : children}
    </ContentCtx.Provider>
  );
}

export { mergeWithDefaults };

export function useContent() {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

// Helper hooks for common derived values
export function useContacts() {
  const { content } = useContent();
  const phone = content.contact.phone;
  return {
    ...content.contact,
    PHONE: phone,
    WHATSAPP_URL: `https://wa.me/91${phone}?text=${encodeURIComponent(content.contact.whatsappMessage)}`,
    TEL_URL: `tel:+91${phone}`,
  };
}

export { uid };

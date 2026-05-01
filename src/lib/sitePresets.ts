import { DEFAULT_CONTENT, type SiteContent, uid } from "./content";
import wedding from "@/assets/hero-wedding.jpg";
import birthday from "@/assets/gallery-birthday.jpg";
import haldi from "@/assets/gallery-haldi.jpg";
import cradle from "@/assets/gallery-cradle.jpg";
import engagement from "@/assets/gallery-engagement.jpg";
import mandap from "@/assets/gallery-mandap.jpg";
import corporate from "@/assets/gallery-corporate.jpg";

export type SiteType =
  | "event"
  | "jewellery"
  | "photography"
  | "realestate"
  | "hospital"
  | "custom";

export type ThemePreset = {
  primary: string; // oklch
  rose: string;
  sky: string;
  amber: string;
  fontSerif: string;
  fontSans: string;
};

export type TypeMeta = {
  id: SiteType;
  label: string;
  emoji: string;
  description: string;
  needsProducts: boolean;
  theme: ThemePreset;
};

const FONT_SERIF = "'Playfair Display', serif";
const FONT_SANS = "'Plus Jakarta Sans', sans-serif";

export const TYPES: Record<SiteType, TypeMeta> = {
  event: {
    id: "event",
    label: "Event Planner",
    emoji: "🎉",
    description: "Weddings, birthdays, corporate events.",
    needsProducts: false,
    theme: {
      primary: "oklch(0.74 0.17 60)",
      rose: "oklch(0.92 0.05 20)",
      sky: "oklch(0.92 0.05 230)",
      amber: "oklch(0.93 0.07 80)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
  jewellery: {
    id: "jewellery",
    label: "Jewellery Shop",
    emoji: "💍",
    description: "Gold, diamond, traditional jewellery boutique.",
    needsProducts: true,
    theme: {
      primary: "oklch(0.72 0.15 75)", // gold
      rose: "oklch(0.93 0.04 30)",
      sky: "oklch(0.94 0.03 80)",
      amber: "oklch(0.92 0.09 85)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
  photography: {
    id: "photography",
    label: "Photography Studio",
    emoji: "📸",
    description: "Wedding, portrait, candid photography.",
    needsProducts: false,
    theme: {
      primary: "oklch(0.45 0.04 260)", // muted graphite
      rose: "oklch(0.94 0.02 20)",
      sky: "oklch(0.92 0.03 240)",
      amber: "oklch(0.94 0.04 70)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
  realestate: {
    id: "realestate",
    label: "Real Estate",
    emoji: "🏡",
    description: "Property listings, plots, apartments.",
    needsProducts: true,
    theme: {
      primary: "oklch(0.55 0.13 200)", // teal-blue
      rose: "oklch(0.93 0.04 200)",
      sky: "oklch(0.92 0.05 220)",
      amber: "oklch(0.93 0.06 90)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
  hospital: {
    id: "hospital",
    label: "Hospital / Doctor",
    emoji: "🩺",
    description: "Clinic, doctor consultation booking.",
    needsProducts: false,
    theme: {
      primary: "oklch(0.6 0.14 230)", // medical blue
      rose: "oklch(0.94 0.03 200)",
      sky: "oklch(0.93 0.06 230)",
      amber: "oklch(0.94 0.04 150)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
  custom: {
    id: "custom",
    label: "Custom",
    emoji: "✨",
    description: "Start from a generic business template.",
    needsProducts: false,
    theme: {
      primary: "oklch(0.65 0.18 300)",
      rose: "oklch(0.93 0.04 320)",
      sky: "oklch(0.93 0.05 250)",
      amber: "oklch(0.93 0.06 80)",
      fontSerif: FONT_SERIF, fontSans: FONT_SANS,
    },
  },
};

export type CreateSiteInput = {
  type: SiteType;
  name: string;
  tagline?: string;
  phone: string;
  whatsappMessage?: string;
  email?: string;
  address: string;
  hours?: string;
  instagram?: string;
};

const IMAGES = [wedding, mandap, engagement, haldi, cradle, birthday, corporate];

function presetFor(type: SiteType, name: string): Partial<SiteContent> {
  switch (type) {
    case "jewellery":
      return {
        hero: {
          ...DEFAULT_CONTENT.hero,
          badge: "Heritage Jewellery",
          headingPre: "Timeless ",
          headingHighlight: "Gold",
          headingPost: ", Made for You.",
          subheading: `${name} crafts heirloom-quality jewellery — bridal sets, daily wear gold, diamond solitaires and traditional South Indian designs.`,
          ctaPrimary: "Visit Showroom",
          ctaSecondary: "View Collections",
          stats: [
            { id: uid(), n: "30+", l: "Years" },
            { id: uid(), n: "BIS", l: "Hallmarked" },
            { id: uid(), n: "100%", l: "Trust" },
          ],
        },
        features: [
          { id: uid(), icon: "Award", title: "BIS Hallmarked", text: "Every piece certified for purity — 916 KDM gold, IGI-graded diamonds." },
          { id: uid(), icon: "Sparkles", title: "Bespoke Designs", text: "Custom bridal sets and one-of-a-kind solitaires designed with you." },
          { id: uid(), icon: "Heart", title: "Lifetime Buyback", text: "Transparent pricing and 100% buyback on hallmarked jewellery." },
        ],
        services: [
          { id: uid(), title: "Bridal Collections", image: wedding, description: "Complete bridal sets — necklace, earrings, bangles, waistbelts.", price: "On Request" },
          { id: uid(), title: "Diamond Solitaires", image: engagement, description: "IGI-certified solitaires set in 18K white & rose gold.", price: "₹85,000" },
          { id: uid(), title: "Daily Wear Gold", image: mandap, description: "Lightweight chains, studs, rings for everyday elegance.", price: "₹15,000" },
          { id: uid(), title: "Temple Jewellery", image: haldi, description: "Traditional South Indian temple sets in antique gold.", price: "₹65,000" },
          { id: uid(), title: "Kids Collection", image: cradle, description: "Mangamala, kaapu and ear studs for little ones.", price: "₹8,500" },
          { id: uid(), title: "Silver & Gifts", image: birthday, description: "Silver pooja items, gift coins and corporate gifting.", price: "₹2,500" },
        ],
        cta: { heading: "Visit our showroom", subheading: "Experience our collection in person — book a private viewing on WhatsApp." },
      };
    case "photography":
      return {
        hero: {
          ...DEFAULT_CONTENT.hero,
          badge: "Wedding & Portrait Photography",
          headingPre: "Stories told in ",
          headingHighlight: "Light",
          headingPost: ".",
          subheading: `${name} captures the candid, unscripted moments of your big day — weddings, engagements, maternity and family portraits.`,
          ctaPrimary: "Book a Shoot",
          ctaSecondary: "View Portfolio",
          stats: [
            { id: uid(), n: "200+", l: "Weddings" },
            { id: uid(), n: "10+", l: "Years" },
            { id: uid(), n: "5★", l: "Rated" },
          ],
        },
        features: [
          { id: uid(), icon: "Heart", title: "Candid Moments", text: "We blend in — capturing real laughter, real tears, real love." },
          { id: uid(), icon: "Sparkles", title: "Cinematic Edits", text: "Color-graded films and albums that feel like a memory in motion." },
          { id: uid(), icon: "Award", title: "Award-Winning Team", text: "Featured in WeddingSutra, Wedmegood and ShaadiSaga." },
        ],
        services: [
          { id: uid(), title: "Wedding Photography", image: wedding, description: "Full-day coverage — pre-wedding to reception, photos + film.", price: "₹85,000" },
          { id: uid(), title: "Engagement Shoot", image: engagement, description: "Outdoor or studio engagement story session.", price: "₹25,000" },
          { id: uid(), title: "Maternity Portraits", image: cradle, description: "Soft, glowing maternity sessions — indoor or outdoor.", price: "₹18,000" },
          { id: uid(), title: "Family Portraits", image: mandap, description: "Multi-generation family sittings, beautifully styled.", price: "₹15,000" },
          { id: uid(), title: "Birthday & Cake Smash", image: birthday, description: "First birthday and milestone celebrations.", price: "₹12,000" },
          { id: uid(), title: "Corporate Headshots", image: corporate, description: "Professional LinkedIn and team headshots.", price: "₹8,000" },
        ],
        cta: { heading: "Let's tell your story", subheading: "Send us your date and venue — we'll send a custom package on WhatsApp." },
      };
    case "realestate":
      return {
        hero: {
          ...DEFAULT_CONTENT.hero,
          badge: "Trusted Real Estate Partner",
          headingPre: "Find Your ",
          headingHighlight: "Dream Home",
          headingPost: ".",
          subheading: `${name} helps you discover verified plots, apartments and villas — with transparent pricing and end-to-end legal support.`,
          ctaPrimary: "View Listings",
          ctaSecondary: "Talk to an Advisor",
          stats: [
            { id: uid(), n: "1000+", l: "Listings" },
            { id: uid(), n: "100%", l: "Verified" },
            { id: uid(), n: "15+", l: "Years" },
          ],
        },
        features: [
          { id: uid(), icon: "Award", title: "RERA Verified", text: "Every project we list is RERA-registered with clear titles." },
          { id: uid(), icon: "Heart", title: "Honest Advice", text: "We tell you what's worth it — and what to avoid." },
          { id: uid(), icon: "Sparkles", title: "End-to-End Support", text: "From site visit to registration — we handle the paperwork." },
        ],
        services: [
          { id: uid(), title: "Residential Plots", image: mandap, description: "Gated community plots with clear titles and approved layouts.", price: "₹12 L+" },
          { id: uid(), title: "2 & 3 BHK Apartments", image: wedding, description: "Move-in ready apartments in prime locations.", price: "₹45 L+" },
          { id: uid(), title: "Luxury Villas", image: engagement, description: "Independent villas with premium amenities.", price: "₹1.2 Cr+" },
          { id: uid(), title: "Commercial Spaces", image: corporate, description: "Office spaces and retail showrooms in high-footfall zones.", price: "On Request" },
          { id: uid(), title: "Farmhouses", image: haldi, description: "Weekend farmhouses on the city outskirts.", price: "₹65 L+" },
          { id: uid(), title: "Investment Plots", image: birthday, description: "High-appreciation plots in upcoming corridors.", price: "₹8 L+" },
        ],
        cta: { heading: "Book a free site visit", subheading: "Tell us your budget and location — we'll arrange a guided visit." },
      };
    case "hospital":
      return {
        hero: {
          ...DEFAULT_CONTENT.hero,
          badge: "Trusted Healthcare",
          headingPre: "Care that ",
          headingHighlight: "Listens",
          headingPost: ".",
          subheading: `${name} brings together experienced doctors, modern diagnostics and compassionate care — all under one roof.`,
          ctaPrimary: "Book Appointment",
          ctaSecondary: "Our Doctors",
          stats: [
            { id: uid(), n: "50+", l: "Doctors" },
            { id: uid(), n: "24/7", l: "Emergency" },
            { id: uid(), n: "20+", l: "Specialities" },
          ],
        },
        features: [
          { id: uid(), icon: "Heart", title: "Patient First", text: "Same-day appointments, transparent pricing, no hidden fees." },
          { id: uid(), icon: "Award", title: "NABH Accredited", text: "Internationally benchmarked quality and safety standards." },
          { id: uid(), icon: "Sparkles", title: "Modern Diagnostics", text: "On-site lab, MRI, CT and ultrasound — reports the same day." },
        ],
        services: [
          { id: uid(), title: "General Medicine", image: corporate, description: "OPD consultations, preventive checkups, chronic care.", price: "₹500" },
          { id: uid(), title: "Cardiology", image: wedding, description: "ECG, ECHO, stress test, heart specialist consults.", price: "₹800" },
          { id: uid(), title: "Pediatrics", image: cradle, description: "Newborn care, vaccinations, child health checkups.", price: "₹600" },
          { id: uid(), title: "Gynaecology", image: haldi, description: "Antenatal care, women's health and fertility consults.", price: "₹700" },
          { id: uid(), title: "Orthopaedics", image: mandap, description: "Joint pain, fractures, sports injury, physiotherapy.", price: "₹700" },
          { id: uid(), title: "Diagnostic Lab", image: engagement, description: "Blood tests, X-ray, ECG, full-body checkup packages.", price: "₹299" },
        ],
        faqs: [
          { id: uid(), q: "How do I book an appointment?", a: "Tap the WhatsApp button — share the doctor name and your preferred date/time. We confirm within minutes." },
          { id: uid(), q: "Do you accept insurance?", a: "Yes — we are empaneled with all major TPAs and government schemes. Bring your card on the visit." },
          { id: uid(), q: "Is there 24/7 emergency?", a: "Yes, our emergency department is open round the clock with on-call specialists." },
          { id: uid(), q: "Are reports available online?", a: "All lab and imaging reports are sent over WhatsApp/email within hours of completion." },
        ],
        cta: { heading: "Need to see a doctor?", subheading: "Book on WhatsApp and skip the queue — we'll confirm your slot in minutes." },
      };
    case "event":
      return {}; // use default content
    case "custom":
    default:
      return {
        hero: {
          ...DEFAULT_CONTENT.hero,
          badge: "Welcome",
          headingPre: "Welcome to ",
          headingHighlight: name,
          headingPost: ".",
          subheading: `Discover what ${name} offers — handcrafted services, modern experiences, and a team that cares.`,
          ctaPrimary: "Get in Touch",
          ctaSecondary: "Learn More",
          stats: DEFAULT_CONTENT.hero.stats,
        },
      };
  }
}

export function buildSiteContent(input: CreateSiteInput): SiteContent {
  const preset = presetFor(input.type, input.name);
  const base: SiteContent = {
    ...DEFAULT_CONTENT,
    ...preset,
    brand: {
      name: input.name,
      tagline: input.tagline || `${input.name} — crafted with care.`,
    },
    contact: {
      ...DEFAULT_CONTENT.contact,
      phone: input.phone,
      whatsappMessage: input.whatsappMessage || `Hi ${input.name}! I'd like to inquire.`,
      email: input.email || DEFAULT_CONTENT.contact.email,
      address: input.address,
      hours: input.hours || DEFAULT_CONTENT.contact.hours,
      instagram: input.instagram || DEFAULT_CONTENT.contact.instagram,
      mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(input.address)}&output=embed`,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`,
    },
    hero: { ...DEFAULT_CONTENT.hero, ...(preset.hero ?? {}) },
    features: preset.features ?? DEFAULT_CONTENT.features,
    services: preset.services ?? DEFAULT_CONTENT.services,
    gallery: preset.gallery ?? DEFAULT_CONTENT.gallery.map((g) => ({ ...g, id: uid() })),
    testimonials: preset.testimonials ?? DEFAULT_CONTENT.testimonials,
    faqs: preset.faqs ?? DEFAULT_CONTENT.faqs,
    about: { ...DEFAULT_CONTENT.about, ...(preset.about ?? {}) },
    cta: { ...DEFAULT_CONTENT.cta, ...(preset.cta ?? {}) },
  };
  return base;
}

// ---------- Sites store (localStorage) ----------

const SITES_KEY = "varna_generated_sites_v1";

export type StoredSite = {
  slug: string;
  type: SiteType;
  createdAt: number;
  content: SiteContent;
  enabled?: boolean;
  passcode?: string;
};

export const DEFAULT_SITE_PASSCODE = "admin1234";

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "site";
}

export function loadSites(): Record<string, StoredSite> {
  try {
    const raw = localStorage.getItem(SITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(all: Record<string, StoredSite>) {
  localStorage.setItem(SITES_KEY, JSON.stringify(all));
}

export function saveSite(site: StoredSite) {
  const all = loadSites();
  all[site.slug] = {
    enabled: true,
    passcode: DEFAULT_SITE_PASSCODE,
    ...all[site.slug],
    ...site,
  };
  persist(all);
}

export function getSite(slug: string): StoredSite | null {
  const s = loadSites()[slug];
  if (!s) return null;
  // Backfill defaults for older saved sites
  return { enabled: true, passcode: DEFAULT_SITE_PASSCODE, ...s };
}

export function deleteSite(slug: string) {
  const all = loadSites();
  delete all[slug];
  persist(all);
}

export function setSiteEnabled(slug: string, enabled: boolean) {
  const all = loadSites();
  if (!all[slug]) return;
  all[slug] = { ...all[slug], enabled };
  persist(all);
}

export function setSitePasscode(slug: string, passcode: string) {
  const all = loadSites();
  if (!all[slug]) return;
  all[slug] = { ...all[slug], passcode };
  persist(all);
}

export function updateSiteContent(slug: string, content: SiteContent) {
  const all = loadSites();
  if (!all[slug]) return;
  all[slug] = { ...all[slug], content };
  persist(all);
}

export function uniqueSlug(name: string): string {
  const base = slugify(name);
  const all = loadSites();
  if (!all[base]) return base;
  let i = 2;
  while (all[`${base}-${i}`]) i++;
  return `${base}-${i}`;
}

// Apply theme tokens to :root style scope
export function themeStyleVars(type: SiteType): Record<string, string> {
  const t = TYPES[type].theme;
  return {
    "--marigold": t.primary,
    "--rose-soft": t.rose,
    "--sky-soft": t.sky,
    "--amber-soft": t.amber,
  };
}


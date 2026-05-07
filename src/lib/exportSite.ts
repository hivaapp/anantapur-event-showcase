import JSZip from "jszip";
import type { StoredSite } from "./sitePresets";
import { themeStyleVars } from "./sitePresets";
import type { SiteContent } from "./content";

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

async function fetchAsBlob(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("svg")) return "svg";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; ext: string } | null {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  const mime = m[1];
  const bin = atob(m[2]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return { blob: new Blob([arr], { type: mime }), ext: extFromMime(mime) };
}

type AssetMap = Map<string, string>;

async function collectAssets(site: StoredSite, zip: JSZip): Promise<AssetMap> {
  const map: AssetMap = new Map();
  const c = site.content;
  const refs = new Set<string>();
  if (c.brand.logo) refs.add(c.brand.logo);
  if (c.hero.image) refs.add(c.hero.image);
  if (c.about.image) refs.add(c.about.image);
  c.services.forEach((s) => s.image && refs.add(s.image));
  c.gallery.forEach((g) => g.image && refs.add(g.image));

  let i = 0;
  for (const ref of refs) {
    i++;
    let blob: Blob | null = null;
    let ext = "jpg";
    if (ref.startsWith("data:")) {
      const d = dataUrlToBlob(ref);
      if (d) { blob = d.blob; ext = d.ext; }
    } else {
      blob = await fetchAsBlob(ref);
      if (blob) ext = extFromMime(blob.type);
    }
    if (!blob) continue;
    const path = `assets/img-${i}.${ext}`;
    zip.file(path, blob);
    map.set(ref, path);
  }
  return map;
}

const A = (m: AssetMap, ref: string | undefined) => (ref && m.get(ref)) || ref || "";

// ---------- Inline SVG icons (lucide-style) ----------
const I = {
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M20 6 9 17l-5-5"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

function iconBox(svg: string, sizeCls: string, colorCls: string) {
  return `<span class="${sizeCls} ${colorCls} inline-flex">${svg}</span>`;
}

const FEATURE_ICON: Record<string, string> = {
  Sparkles: I.sparkles, Heart: I.heart, Award: I.award,
};

// ---------- Shared shell ----------

function tailwindHead(title: string, desc: string, vars: Record<string, string>, ogImage?: string) {
  const styleVars = Object.entries(vars).map(([k, v]) => `${k}:${v};`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}" />` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=aspect-ratio,line-clamp"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        border: 'var(--border)',
        marigold: 'var(--marigold)',
        'rose-soft': 'var(--rose-soft)',
        'sky-soft': 'var(--sky-soft)',
        'amber-soft': 'var(--amber-soft)',
        primary: { DEFAULT: 'var(--marigold)', foreground: 'var(--primary-foreground)' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in .8s ease-out both',
        'fade-up': 'fade-up .9s cubic-bezier(.22,1,.36,1) both',
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'pulse-slow': 'pulse-ring 2.4s ease-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        tilt: 'tilt 8s ease-in-out infinite',
        gradient: 'gradient-pan 12s ease infinite',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'fade-up': { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        shimmer: { '0%,100%': { opacity: .6, transform: 'scale(1)' }, '50%': { opacity: 1, transform: 'scale(1.06)' } },
        'pulse-ring': { '0%': { boxShadow: '0 0 0 0 color-mix(in oklab, var(--marigold) 60%, transparent)' }, '80%,100%': { boxShadow: '0 0 0 18px transparent' } },
        blob: {
          '0%,100%': { borderRadius: '42% 58% 70% 30% / 45% 30% 70% 55%', transform: 'translate(0,0) rotate(0)' },
          '33%': { borderRadius: '70% 30% 40% 60% / 60% 40% 60% 40%', transform: 'translate(20px,-20px) rotate(40deg)' },
          '66%': { borderRadius: '30% 70% 60% 40% / 50% 60% 40% 50%', transform: 'translate(-20px,15px) rotate(-30deg)' }
        },
        tilt: { '0%,100%': { transform: 'rotate(-1deg)' }, '50%': { transform: 'rotate(1.2deg)' } },
        'gradient-pan': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      }
    }
  }
}
</script>
<style>
:root{
  --radius: 1rem;
  --background: oklch(0.99 0.01 80);
  --foreground: oklch(0.18 0.02 30);
  --card: oklch(1 0 0);
  --muted: oklch(0.96 0.015 60);
  --muted-foreground: oklch(0.5 0.03 40);
  --border: oklch(0.9 0.02 60);
  --primary-foreground: oklch(0.99 0.01 80);
  --marigold: oklch(0.72 0.19 55);
  --rose-soft: oklch(0.92 0.05 20);
  --sky-soft: oklch(0.93 0.04 230);
  --amber-soft: oklch(0.94 0.06 80);
  ${styleVars}
}
html,body{background:var(--background);color:var(--foreground);font-family:'Plus Jakarta Sans',system-ui,sans-serif;}
h1,h2,h3,h4{font-family:'Playfair Display',serif;}
.text-shine{
  background: linear-gradient(110deg, var(--marigold) 0%, oklch(0.85 0.18 70) 35%, var(--marigold) 70%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: gradient-pan 6s ease infinite;
}
@keyframes gradient-pan {0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.card-hover{transition: transform .6s cubic-bezier(.22,1,.36,1), box-shadow .6s cubic-bezier(.22,1,.36,1);}
.card-hover:hover{transform: translateY(-6px); box-shadow: 0 30px 60px -25px color-mix(in oklab, var(--marigold) 35%, transparent);}
.shine-overlay{position:relative;overflow:hidden;isolation:isolate;}
.shine-overlay::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg, transparent 35%, rgba(255,255,255,.35) 50%, transparent 65%);transform:translateX(-120%) skewX(-20deg);transition:transform 1.1s cubic-bezier(.22,1,.36,1);pointer-events:none;}
.group:hover .shine-overlay::after, .shine-overlay:hover::after{transform:translateX(220%) skewX(-20deg);}
.underline-grow{position:relative;}
.underline-grow::after{content:"";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--marigold);transform:scaleX(0);transform-origin:right;transition:transform .5s cubic-bezier(.22,1,.36,1);}
.underline-grow:hover::after{transform:scaleX(1);transform-origin:left;}
details.faq[open] summary .chev{transform:rotate(180deg)}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
</style>
</head>
<body class="overflow-x-hidden">`;
}

const tailEnd = `</body></html>`;

// ---------- Header ----------

function header(active: string, c: SiteContent, m: AssetMap) {
  const logo = A(m, c.brand.logo);
  const logoHeight = c.brand.logoHeight ?? 40;
  const links: { href: string; label: string }[] = [
    { href: "index.html", label: "Home" },
    { href: "services.html", label: "Services" },
    { href: "gallery.html", label: "Gallery" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" },
  ];
  const linkHtml = links.map(l => {
    const isActive = l.href === active;
    return `<a href="${l.href}" class="${isActive ? "text-marigold" : "text-foreground/70"} hover:text-marigold transition-colors">${l.label}</a>`;
  }).join("");
  const tel = `tel:+91${c.contact.phone}`;
  return `<header class="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
    <a href="index.html" class="inline-flex items-center gap-2 text-2xl font-serif italic font-bold text-marigold tracking-tight">
      ${logo
        ? `<img src="${logo}" alt="${esc(c.brand.name)}" style="height:${logoHeight}px" class="w-auto object-contain" />`
        : esc(c.brand.name)}
    </a>
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">${linkHtml}</nav>
    <div class="flex items-center gap-3">
      <a href="${tel}" class="hidden sm:inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-marigold transition-colors">
        <span class="w-3.5 h-3.5">${I.phone}</span> Call
      </a>
    </div>
  </div>
</header>`;
}

function footer(c: SiteContent) {
  const phone = c.contact.phone;
  const wa = `https://wa.me/91${phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const tel = `tel:+91${phone}`;
  return `<footer class="bg-foreground text-background mt-24">
  <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
    <div class="md:col-span-2">
      <h3 class="font-serif italic text-3xl text-marigold mb-4">${esc(c.brand.name)}</h3>
      <p class="text-background/60 text-sm leading-relaxed max-w-md">${esc(c.brand.tagline)}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-widest text-marigold mb-4">Explore</p>
      <ul class="space-y-2 text-sm text-background/70">
        <li><a href="services.html" class="hover:text-marigold">Services</a></li>
        <li><a href="gallery.html" class="hover:text-marigold">Gallery</a></li>
        <li><a href="about.html" class="hover:text-marigold">About</a></li>
        <li><a href="contact.html" class="hover:text-marigold">Contact</a></li>
      </ul>
    </div>
    <div>
      <p class="text-xs uppercase tracking-widest text-marigold mb-4">Reach Us</p>
      <ul class="space-y-3 text-sm text-background/70">
        <li><a href="${tel}" class="flex items-center gap-2 hover:text-marigold"><span class="w-4 h-4">${I.phone}</span>+91 ${esc(phone)}</a></li>
        <li><a href="${wa}" target="_blank" rel="noopener" class="flex items-center gap-2 hover:text-marigold"><span class="w-4 h-4">${I.message}</span>WhatsApp</a></li>
        <li><a href="${esc(c.contact.mapsLink)}" target="_blank" rel="noopener" class="flex items-center gap-2 hover:text-marigold"><span class="w-4 h-4">${I.mapPin}</span>${esc(c.contact.address)}</a></li>
        <li><a href="${esc(c.contact.instagram)}" target="_blank" rel="noopener" class="flex items-center gap-2 hover:text-marigold"><span class="w-4 h-4">${I.instagram}</span>Instagram</a></li>
      </ul>
    </div>
  </div>
  <div class="border-t border-background/10 py-6 text-center text-xs text-background/40 uppercase tracking-widest">
    © ${new Date().getFullYear()} ${esc(c.brand.name)}
  </div>
</footer>`;
}

function floatingActions(c: SiteContent) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const tel = `tel:+91${c.contact.phone}`;
  return `<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    <a href="${wa}" target="_blank" rel="noopener" class="group flex items-center gap-2 bg-emerald-500 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform animate-pulse-slow">
      <span class="w-5 h-5">${I.message}</span><span class="text-sm font-semibold hidden sm:inline">WhatsApp</span>
    </a>
    <a href="${tel}" class="flex items-center gap-2 bg-foreground text-background pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-transform">
      <span class="w-5 h-5">${I.phone}</span><span class="text-sm font-semibold hidden sm:inline">Call</span>
    </a>
  </div>`;
}

// ---------- Pages ----------

function indexBody(c: SiteContent, m: AssetMap) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const stats = c.hero.stats.map(s =>
    `<div><span class="block text-2xl font-serif text-marigold">${esc(s.n)}</span><span class="text-muted-foreground">${esc(s.l)}</span></div>`
  ).join("");
  const features = c.features.map(f => {
    const svg = FEATURE_ICON[f.icon] ?? I.sparkles;
    return `<div class="group p-8 rounded-3xl bg-card border border-border card-hover shine-overlay">
      <div class="w-14 h-14 rounded-2xl bg-marigold/10 flex items-center justify-center mb-5 group-hover:bg-marigold transition-all duration-500">
        <span class="w-7 h-7 text-marigold group-hover:text-white transition-colors">${svg}</span>
      </div>
      <h3 class="text-xl font-serif mb-2">${esc(f.title)}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed">${esc(f.text)}</p>
    </div>`;
  }).join("");
  const services = c.services.slice(0, 6).map(s => `
    <div class="group p-6 bg-card/60 backdrop-blur border border-border rounded-3xl card-hover h-full">
      <div class="aspect-square rounded-2xl overflow-hidden mb-5 bg-muted shine-overlay">
        <img src="${A(m, s.image)}" alt="${esc(s.title)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
      </div>
      <h3 class="text-xl font-serif italic mb-2 group-hover:text-marigold transition-colors">${esc(s.title)}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">${esc(s.description)}</p>
      <div class="flex justify-between items-center pt-4 border-t border-border">
        <span class="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starting at</span>
        <span class="text-lg font-medium tabular-nums text-marigold">${esc(s.price)}</span>
      </div>
    </div>`).join("");
  const testimonials = c.testimonials.map(t => {
    const stars = Array.from({ length: t.rating }).map(() => `<span class="w-4 h-4 text-marigold">${I.star}</span>`).join("");
    return `<div class="p-8 rounded-[2rem] bg-card/70 backdrop-blur border border-border shadow-xl shine-overlay">
      <div class="flex gap-1 mb-5">${stars}</div>
      <p class="text-lg font-serif italic leading-relaxed text-foreground/90 mb-6">"${esc(t.quote)}"</p>
      <div class="pt-5 border-t border-border">
        <div class="font-semibold">${esc(t.name)}</div>
        <div class="text-sm text-muted-foreground">${esc(t.event)}</div>
      </div>
    </div>`;
  }).join("");
  const faqs = c.faqs.map(f => `
    <details class="faq border border-border rounded-2xl bg-card/60 backdrop-blur px-5 group">
      <summary class="flex items-center justify-between cursor-pointer list-none font-serif text-lg py-5 hover:text-marigold transition-colors">
        <span>${esc(f.q)}</span>
        <span class="chev w-4 h-4 transition-transform"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="m6 9 6 6 6-6"/></svg></span>
      </summary>
      <p class="text-muted-foreground leading-relaxed pb-5">${esc(f.a)}</p>
    </details>`).join("");

  return `${header("index.html", c, m)}
<main class="bg-gradient-to-br from-background via-rose-soft/20 to-sky-soft/20">
  <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 px-6 lg:px-10">
    <div aria-hidden class="absolute -top-32 -left-20 w-[28rem] h-[28rem] bg-gradient-to-tr from-marigold/30 via-rose-soft/40 to-amber-soft/40 blur-3xl animate-blob -z-10"></div>
    <div aria-hidden class="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-gradient-to-bl from-sky-soft/40 via-rose-soft/30 to-marigold/20 blur-3xl animate-blob -z-10" style="animation-delay:4s"></div>
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
      <div class="flex-1 space-y-7 z-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-marigold/10 border border-marigold/20 rounded-full text-marigold text-xs font-bold uppercase tracking-widest animate-pulse-slow">
          <span class="w-3.5 h-3.5 animate-shimmer">${I.sparkles}</span> ${esc(c.hero.badge)}
        </div>
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-serif italic leading-[1.05]">
          ${esc(c.hero.headingPre)}<span class="text-shine">${esc(c.hero.headingHighlight)}</span>${esc(c.hero.headingPost)}
        </h1>
        <p class="max-w-[50ch] text-lg text-muted-foreground leading-relaxed">${esc(c.hero.subheading)}</p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="${wa}" target="_blank" rel="noopener" class="group/cta relative inline-flex items-center gap-2 px-7 py-4 bg-marigold text-white rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 transition-all duration-500 shine-overlay">
            ${esc(c.hero.ctaPrimary)} <span class="w-4 h-4">${I.arrowRight}</span>
          </a>
          <a href="gallery.html" class="inline-flex items-center gap-2 px-7 py-4 border border-border bg-background/60 backdrop-blur rounded-full font-semibold hover:bg-marigold/10 hover:-translate-y-1 transition-all duration-500">
            ${esc(c.hero.ctaSecondary)}
          </a>
        </div>
        <div class="flex flex-wrap gap-8 pt-6 text-sm">${stats}</div>
      </div>
      <div class="flex-1 w-full max-w-lg lg:max-w-none">
        <div class="relative animate-tilt">
          <div class="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
            <img src="${A(m, c.hero.image)}" alt="${esc(c.brand.name)}" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          <div class="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-gradient-to-tr from-rose-soft/60 via-sky-soft/60 to-amber-soft/60 blur-3xl animate-float -z-10"></div>
          <div class="absolute -bottom-12 -right-12 w-60 h-60 rounded-full bg-gradient-to-bl from-amber-soft/50 via-rose-soft/50 to-sky-soft/50 blur-3xl animate-float-slow -z-10"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-6 lg:px-10">
    <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">${features}</div>
  </section>

  <section class="py-20 px-6 lg:px-10">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-2">What We Offer</p>
          <h2 class="text-4xl lg:text-5xl font-serif italic">Curated Collections</h2>
        </div>
        <a href="services.html" class="group text-sm font-semibold text-marigold inline-flex items-center gap-2 underline-grow">
          View all <span class="w-4 h-4">${I.arrowRight}</span>
        </a>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${services}</div>
    </div>
  </section>

  <section class="py-20 px-6 lg:px-10 relative overflow-hidden">
    <div aria-hidden class="absolute top-1/2 -translate-y-1/2 -left-32 w-[28rem] h-[28rem] bg-gradient-to-tr from-rose-soft/30 to-marigold/20 blur-3xl animate-blob -z-10"></div>
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-2">Kind Words</p>
        <h2 class="text-4xl lg:text-5xl font-serif italic">Loved by Families</h2>
      </div>
      <div class="grid md:grid-cols-2 gap-6">${testimonials}</div>
    </div>
  </section>

  <section class="py-20 px-6 lg:px-10">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-2">Questions</p>
        <h2 class="text-4xl lg:text-5xl font-serif italic">Frequently Asked</h2>
      </div>
      <div class="space-y-3">${faqs}</div>
    </div>
  </section>

  <section class="py-20 px-6 lg:px-10">
    <div class="max-w-5xl mx-auto p-10 lg:p-16 rounded-[2.5rem] text-white text-center shadow-2xl shadow-marigold/30 relative overflow-hidden"
      style="background:linear-gradient(120deg, var(--marigold), oklch(0.72 0.2 30), oklch(0.78 0.15 70), var(--marigold));background-size:300% 300%;animation:gradient-pan 10s ease infinite">
      <div aria-hidden class="absolute top-0 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-float"></div>
      <div aria-hidden class="absolute bottom-0 right-1/4 w-52 h-52 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
      <div class="relative">
        <h2 class="text-4xl lg:text-5xl font-serif italic mb-4">${esc(c.cta.heading)}</h2>
        <p class="max-w-xl mx-auto mb-8 opacity-90">${esc(c.cta.subheading)}</p>
        <div class="flex flex-wrap gap-4 justify-center">
          <a href="${wa}" target="_blank" rel="noopener" class="px-8 py-4 bg-white text-marigold rounded-full font-semibold hover:scale-105 transition-all duration-500 shine-overlay">Chat on WhatsApp</a>
          <a href="contact.html" class="px-8 py-4 border border-white/40 backdrop-blur rounded-full font-semibold hover:bg-white/10 hover:scale-105 transition-all duration-500">Contact</a>
        </div>
      </div>
    </div>
  </section>
</main>
${footer(c)}${floatingActions(c)}`;
}

function servicesBody(c: SiteContent, m: AssetMap) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const includes = ["Site visit & consultation","Custom theme design","Setup & dismantling","Dedicated coordinator"];
  const items = c.services.map(s => `
    <article class="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden card-hover h-full">
      <div class="aspect-[4/3] overflow-hidden bg-muted shine-overlay">
        <img src="${A(m, s.image)}" alt="${esc(s.title)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
      </div>
      <div class="p-6 flex-1 flex flex-col">
        <h2 class="text-2xl font-serif italic mb-2 group-hover:text-marigold transition-colors">${esc(s.title)}</h2>
        <p class="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">${esc(s.description)}</p>
        <ul class="space-y-1.5 mb-5">
          ${includes.map(i => `<li class="flex items-center gap-2 text-xs text-foreground/70"><span class="w-3.5 h-3.5 text-marigold">${I.check}</span> ${esc(i)}</li>`).join("")}
        </ul>
        <div class="flex items-end justify-between pt-4 border-t border-border">
          <div>
            <span class="block text-[10px] uppercase tracking-widest text-muted-foreground">Starting at</span>
            <span class="text-2xl font-serif text-marigold tabular-nums">${esc(s.price)}</span>
          </div>
          <a href="${wa}" target="_blank" rel="noopener" class="px-5 py-2.5 bg-foreground text-background rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-marigold transition-all duration-500">Inquire</a>
        </div>
      </div>
    </article>`).join("");
  return `${header("services.html", c, m)}
<main class="bg-gradient-to-br from-background via-amber-soft/20 to-rose-soft/20 pt-12 pb-20 px-6 lg:px-10 relative">
  <div aria-hidden class="absolute top-10 right-10 w-80 h-80 bg-marigold/20 blur-3xl rounded-full animate-blob -z-10"></div>
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Pricing & Packages</p>
      <h1 class="text-5xl lg:text-6xl font-serif italic mb-6">Every event, <span class="text-shine">beautifully</span> done.</h1>
      <p class="text-lg text-muted-foreground">Starting prices reflect our standard packages — every quote is fully customizable.</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${items}</div>
  </div>
</main>
${footer(c)}${floatingActions(c)}`;
}

function galleryBody(c: SiteContent, m: AssetMap) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const items = c.gallery.map((g, i) => {
    const aspect = i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]";
    return `<figure class="group break-inside-avoid mb-5 relative rounded-3xl overflow-hidden bg-muted shadow-lg hover:shadow-2xl hover:shadow-marigold/20 hover:-translate-y-1 transition-all duration-700 shine-overlay">
      <img src="${A(m, g.image)}" alt="${esc(g.caption)}" loading="lazy" class="w-full object-cover group-hover:scale-110 transition-transform duration-[1400ms] ${aspect}" />
      <figcaption class="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <p class="font-serif italic text-xl">${esc(g.caption)}</p>
      </figcaption>
    </figure>`;
  }).join("");
  return `${header("gallery.html", c, m)}
<main class="bg-gradient-to-br from-background via-sky-soft/20 to-rose-soft/20 pt-12 pb-20 px-6 lg:px-10 relative">
  <div aria-hidden class="absolute -top-20 left-1/4 w-96 h-96 bg-rose-soft/40 blur-3xl rounded-full animate-blob -z-10"></div>
  <div class="max-w-7xl mx-auto">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Our Portfolio</p>
      <h1 class="text-5xl lg:text-6xl font-serif italic mb-6">Moments we've <span class="text-shine">crafted</span>.</h1>
      <p class="text-lg text-muted-foreground">A glimpse into the celebrations we've had the honor of decorating.</p>
    </div>
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-5">${items}</div>
    <div class="text-center mt-16">
      <a href="${wa}" target="_blank" rel="noopener" class="inline-flex items-center px-8 py-4 bg-marigold text-white rounded-full font-semibold shadow-xl shadow-marigold/30 hover:-translate-y-1 transition-all duration-500 shine-overlay">Plan your event with us</a>
    </div>
  </div>
</main>
${footer(c)}${floatingActions(c)}`;
}

function aboutBody(c: SiteContent, m: AssetMap) {
  const a = c.about;
  const stats = a.stats.map(s => `<div><span class="block text-3xl font-serif text-marigold">${esc(s.n)}</span><span class="text-xs text-muted-foreground uppercase tracking-widest">${esc(s.l)}</span></div>`).join("");
  const steps = a.steps.map(s => `
    <div class="group p-8 rounded-3xl bg-card border border-border card-hover h-full">
      <span class="text-5xl font-serif italic text-marigold/40 group-hover:text-marigold transition-colors duration-500">${esc(s.num)}</span>
      <h3 class="text-xl font-serif mt-3 mb-2">${esc(s.title)}</h3>
      <p class="text-sm text-muted-foreground leading-relaxed">${esc(s.text)}</p>
    </div>`).join("");
  return `${header("about.html", c, m)}
<main class="bg-gradient-to-br from-background via-amber-soft/20 to-sky-soft/20 pt-12 pb-20 px-6 lg:px-10 relative">
  <div aria-hidden class="absolute top-40 -right-20 w-96 h-96 bg-marigold/20 blur-3xl rounded-full animate-blob -z-10"></div>
  <div class="max-w-6xl mx-auto">
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
      <div class="relative animate-tilt">
        <div class="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 hover:rotate-0 transition-all duration-700">
          <img src="${A(m, a.image)}" alt="Our work" class="w-full h-full object-cover" />
        </div>
        <div class="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-gradient-to-tr from-marigold/40 via-rose-soft/60 to-amber-soft/60 blur-3xl animate-float -z-10"></div>
      </div>
      <div class="space-y-6">
        <p class="text-xs uppercase tracking-widest text-marigold font-bold">${esc(a.eyebrow)}</p>
        <h1 class="text-5xl font-serif italic leading-tight">${esc(a.headingPre)}<span class="text-shine">${esc(a.headingHighlight)}</span>${esc(a.headingPost)}</h1>
        <p class="text-lg text-muted-foreground leading-relaxed">${esc(a.paragraph1)}</p>
        <p class="text-muted-foreground leading-relaxed">${esc(a.paragraph2)}</p>
        <div class="grid grid-cols-3 gap-4 pt-4">${stats}</div>
      </div>
    </div>
    <div class="grid md:grid-cols-3 gap-6">${steps}</div>
  </div>
</main>
${footer(c)}${floatingActions(c)}`;
}

function contactBody(c: SiteContent, m: AssetMap) {
  const phone = c.contact.phone;
  const wa = `https://wa.me/91${phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const tel = `tel:+91${phone}`;
  const cards = [
    { Icon: I.mapPin, label: "Studio", value: c.contact.address },
    { Icon: I.clock,  label: "Hours",  value: c.contact.hours },
    { Icon: I.mail,   label: "Email",  value: c.contact.email },
  ].map(it => `
    <div class="p-6 rounded-2xl bg-card border border-border card-hover h-full">
      <span class="block w-6 h-6 text-marigold mb-3">${it.Icon}</span>
      <p class="text-xs uppercase tracking-widest text-muted-foreground mb-1">${esc(it.label)}</p>
      <p class="font-medium">${esc(it.value)}</p>
    </div>`).join("");

  return `${header("contact.html", c, m)}
<main class="bg-gradient-to-br from-background via-rose-soft/20 to-amber-soft/20 pt-12 pb-20 px-6 lg:px-10 relative">
  <div aria-hidden class="absolute top-20 left-1/4 w-96 h-96 bg-emerald-200/30 blur-3xl rounded-full animate-blob -z-10"></div>
  <div class="max-w-6xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-14">
      <p class="text-xs uppercase tracking-widest text-marigold font-bold mb-3">Get in Touch</p>
      <h1 class="text-5xl lg:text-6xl font-serif italic mb-4">Let's plan your <span class="text-shine">celebration</span>.</h1>
      <p class="text-lg text-muted-foreground">We respond fastest on WhatsApp — usually within an hour.</p>
    </div>
    <div class="grid lg:grid-cols-2 gap-6 mb-12">
      <a href="${wa}" target="_blank" rel="noopener" class="group block p-8 rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-500 shine-overlay h-full">
        <span class="block w-10 h-10 mb-4">${I.message}</span>
        <h2 class="text-2xl font-serif italic mb-2">WhatsApp Chat</h2>
        <p class="opacity-90 mb-4">Fastest way to reach us — share your event details and get a quote.</p>
        <span class="inline-flex items-center gap-2 font-semibold">+91 ${esc(phone)} →</span>
      </a>
      <a href="${tel}" class="group block p-8 rounded-3xl bg-foreground text-background shadow-xl hover:-translate-y-1 transition-all duration-500 shine-overlay h-full">
        <span class="block w-10 h-10 mb-4 text-marigold">${I.phone}</span>
        <h2 class="text-2xl font-serif italic mb-2">Call Us</h2>
        <p class="opacity-80 mb-4">Prefer to talk? We're a phone call away during business hours.</p>
        <span class="inline-flex items-center gap-2 font-semibold text-marigold">+91 ${esc(phone)} →</span>
      </a>
    </div>
    <div class="grid md:grid-cols-3 gap-6 mb-12">${cards}</div>
    <div class="rounded-[2rem] overflow-hidden border border-border shadow-2xl">
      <div class="aspect-[16/9] bg-muted">
        <iframe src="${esc(c.contact.mapsEmbed)}" class="w-full h-full" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Studio location"></iframe>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-4 p-6 bg-card">
        <div>
          <p class="font-serif italic text-xl">Visit our studio</p>
          <p class="text-sm text-muted-foreground">${esc(c.contact.address)}</p>
        </div>
        <a href="${esc(c.contact.mapsLink)}" target="_blank" rel="noopener" class="px-6 py-3 bg-marigold text-white rounded-full text-sm font-semibold hover:scale-105 transition-all duration-500 shine-overlay">Open in Google Maps</a>
      </div>
    </div>
  </div>
</main>
${footer(c)}${floatingActions(c)}`;
}

function readmeMd(site: StoredSite) {
  return `# ${site.content.brand.name} — Static Website

Generated on ${new Date().toLocaleString()}.

## Files
- index.html, services.html, gallery.html, about.html, contact.html
- assets/ — images

## Hosting
Pure static site — drop the folder onto Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any web server. No build step. Tailwind is loaded from CDN so you must remain online for the styles. To self-host the CSS, replace the \`<script src="https://cdn.tailwindcss.com...">\` with a compiled tailwind.css file.
`;
}

export async function exportSiteAsZip(site: StoredSite): Promise<Blob> {
  const zip = new JSZip();
  const assets = await collectAssets(site, zip);
  const vars = themeStyleVars(site);
  const c = site.content;
  const og = A(assets, c.hero.image);

  zip.file("README.md", readmeMd(site));
  zip.file(
    "index.html",
    tailwindHead(`${c.brand.name} — ${c.brand.tagline}`, c.brand.tagline, vars, og) + indexBody(c, assets) + tailEnd
  );
  zip.file(
    "services.html",
    tailwindHead(`Services — ${c.brand.name}`, `Services offered by ${c.brand.name}`, vars, og) + servicesBody(c, assets) + tailEnd
  );
  zip.file(
    "gallery.html",
    tailwindHead(`Gallery — ${c.brand.name}`, `Gallery from ${c.brand.name}`, vars, og) + galleryBody(c, assets) + tailEnd
  );
  zip.file(
    "about.html",
    tailwindHead(`About — ${c.brand.name}`, `About ${c.brand.name}`, vars, og) + aboutBody(c, assets) + tailEnd
  );
  zip.file(
    "contact.html",
    tailwindHead(`Contact — ${c.brand.name}`, `Contact ${c.brand.name}`, vars, og) + contactBody(c, assets) + tailEnd
  );

  return await zip.generateAsync({ type: "blob" });
}

export async function downloadSiteZip(site: StoredSite) {
  const blob = await exportSiteAsZip(site);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${site.slug}-website.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

import JSZip from "jszip";
import type { StoredSite } from "./sitePresets";
import { themeStyleVars } from "./sitePresets";
import type { SiteContent } from "./content";

const esc = (s: string) =>
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

type AssetMap = Map<string, string>; // original ref -> "assets/xxx.jpg"

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

function navHtml(active: string, brand: string, logoSrc: string, logoHeight: number) {
  const link = (href: string, label: string) =>
    `<a href="${href}" class="${active === href ? "active" : ""}">${label}</a>`;
  const brandHtml = logoSrc
    ? `<img src="${logoSrc}" alt="${esc(brand)}" style="height:${logoHeight}px;width:auto;" />`
    : `<span class="brand-name">${esc(brand)}</span>`;
  return `<header class="site-header">
    <div class="container nav">
      <a href="index.html" class="brand">${brandHtml}</a>
      <nav>
        ${link("index.html", "Home")}
        ${link("services.html", "Services")}
        ${link("gallery.html", "Gallery")}
        ${link("about.html", "About")}
        ${link("contact.html", "Contact")}
      </nav>
    </div>
  </header>`;
}

function footerHtml(c: SiteContent) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  return `<footer class="site-footer">
    <div class="container foot">
      <div>
        <p class="foot-brand">${esc(c.brand.name)}</p>
        <p class="muted">${esc(c.brand.tagline)}</p>
      </div>
      <div>
        <p><strong>Contact</strong></p>
        <p class="muted">${esc(c.contact.address)}</p>
        <p class="muted">${esc(c.contact.phone)} · ${esc(c.contact.email)}</p>
        <p class="muted">${esc(c.contact.hours)}</p>
      </div>
      <div>
        <p><strong>Quick</strong></p>
        <p><a href="${wa}" target="_blank" rel="noopener">WhatsApp Us</a></p>
        <p><a href="${esc(c.contact.instagram)}" target="_blank" rel="noopener">Instagram</a></p>
      </div>
    </div>
    <div class="container">
      <p class="muted small">© ${new Date().getFullYear()} ${esc(c.brand.name)}. All rights reserved.</p>
    </div>
  </footer>`;
}

function pageShell(title: string, desc: string, body: string, vars: Record<string, string>) {
  const styleVars = Object.entries(vars)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
  <style>:root{${styleVars}}</style>
</head>
<body>
  ${body}
</body>
</html>`;
}

const STYLES_CSS = `:root{
  --bg:#fffaf3; --fg:#1c1a17; --muted:#6b6258; --card:#fff; --border:#ecdfcf;
  --primary:var(--marigold,#e8a93b);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--fg);font-family:'Plus Jakarta Sans',system-ui,sans-serif;line-height:1.6}
img{max-width:100%;display:block}
a{color:var(--primary);text-decoration:none}
a:hover{text-decoration:underline}
.container{max-width:1100px;margin:0 auto;padding:0 24px}
h1,h2,h3{font-family:'Playfair Display',serif;font-style:italic;font-weight:700;letter-spacing:-0.01em;line-height:1.15;margin:0 0 .5em}
h1{font-size:clamp(2rem,5vw,3.5rem)}
h2{font-size:clamp(1.6rem,3.5vw,2.4rem)}
h3{font-size:1.25rem}
p{margin:0 0 1em}
.muted{color:var(--muted)}
.small{font-size:.85rem}
.site-header{position:sticky;top:0;background:rgba(255,250,243,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);z-index:10}
.nav{display:flex;align-items:center;justify-content:space-between;height:72px;gap:16px;flex-wrap:wrap}
.brand{display:inline-flex;align-items:center;gap:8px;color:var(--fg)}
.brand-name{font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:1.4rem;color:var(--primary)}
nav a{margin-left:18px;color:var(--fg);font-size:.95rem;text-decoration:none}
nav a:hover,nav a.active{color:var(--primary)}
.hero{padding:60px 0 80px;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
@media (max-width:820px){.hero{grid-template-columns:1fr}}
.badge{display:inline-block;padding:6px 14px;border:1px solid var(--primary);color:var(--primary);border-radius:999px;font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;font-weight:700;margin-bottom:18px}
.hl{color:var(--primary);font-style:italic}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}
.btn{display:inline-block;padding:12px 24px;border-radius:999px;background:var(--primary);color:#fff;font-weight:600;border:none;cursor:pointer}
.btn.outline{background:transparent;color:var(--fg);border:1px solid var(--border)}
.stats{display:flex;gap:32px;margin-top:32px;flex-wrap:wrap}
.stat .n{font-family:'Playfair Display',serif;font-style:italic;font-size:1.75rem;color:var(--primary)}
.stat .l{font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:var(--muted)}
.hero-img{border-radius:24px;overflow:hidden;aspect-ratio:4/5;background:#eee}
.hero-img img{width:100%;height:100%;object-fit:cover}
section{padding:64px 0}
.grid{display:grid;gap:24px}
.grid.cols-3{grid-template-columns:repeat(3,1fr)}
.grid.cols-2{grid-template-columns:repeat(2,1fr)}
@media (max-width:820px){.grid.cols-3,.grid.cols-2{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--border);border-radius:20px;overflow:hidden}
.card .body{padding:20px}
.card img{aspect-ratio:4/3;object-fit:cover;width:100%}
.section-eyebrow{display:block;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--primary);font-weight:700;margin-bottom:8px}
.center{text-align:center}
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:820px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}
.gallery-grid img{aspect-ratio:1;object-fit:cover;border-radius:14px}
.faq{border-bottom:1px solid var(--border);padding:18px 0}
.faq summary{cursor:pointer;font-weight:600;font-family:'Playfair Display',serif;font-style:italic;font-size:1.1rem;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
@media (max-width:820px){.contact-grid{grid-template-columns:1fr}}
.contact-grid iframe{width:100%;height:380px;border:0;border-radius:20px}
.site-footer{margin-top:80px;border-top:1px solid var(--border);background:#fff;padding:48px 0 24px}
.foot{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-bottom:32px}
@media (max-width:820px){.foot{grid-template-columns:1fr}}
.foot-brand{font-family:'Playfair Display',serif;font-style:italic;font-size:1.3rem;color:var(--primary);margin:0 0 4px}
.wa-fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:20;text-decoration:none;font-size:24px}
`;

function waFab(c: SiteContent) {
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  return `<a class="wa-fab" href="${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>`;
}

function indexPage(site: StoredSite, m: AssetMap) {
  const c = site.content;
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const featuresHtml = c.features.map((f) => `
    <div class="card"><div class="body">
      <h3>${esc(f.title)}</h3><p class="muted">${esc(f.text)}</p>
    </div></div>`).join("");
  const servicesPreview = c.services.slice(0, 3).map((s) => `
    <div class="card">
      <img src="${A(m, s.image)}" alt="${esc(s.title)}" loading="lazy" />
      <div class="body">
        <h3>${esc(s.title)}</h3>
        <p class="muted">${esc(s.description)}</p>
        <p><strong>${esc(s.price)}</strong></p>
      </div>
    </div>`).join("");
  const stats = c.hero.stats.map((s) => `<div class="stat"><div class="n">${esc(s.n)}</div><div class="l">${esc(s.l)}</div></div>`).join("");
  return `
  ${navHtml("index.html", c.brand.name, A(m, c.brand.logo), c.brand.logoHeight ?? 40)}
  <main>
    <section class="container hero">
      <div>
        <span class="badge">${esc(c.hero.badge)}</span>
        <h1>${esc(c.hero.headingPre)}<span class="hl">${esc(c.hero.headingHighlight)}</span>${esc(c.hero.headingPost)}</h1>
        <p class="muted">${esc(c.hero.subheading)}</p>
        <div class="cta-row">
          <a class="btn" href="${wa}" target="_blank" rel="noopener">${esc(c.hero.ctaPrimary)}</a>
          <a class="btn outline" href="gallery.html">${esc(c.hero.ctaSecondary)}</a>
        </div>
        <div class="stats">${stats}</div>
      </div>
      <div class="hero-img"><img src="${A(m, c.hero.image)}" alt="${esc(c.brand.name)}" /></div>
    </section>

    <section class="container">
      <div class="center" style="margin-bottom:32px">
        <span class="section-eyebrow">Why us</span>
        <h2>Crafted with care</h2>
      </div>
      <div class="grid cols-3">${featuresHtml}</div>
    </section>

    <section class="container">
      <div class="center" style="margin-bottom:32px">
        <span class="section-eyebrow">Services</span>
        <h2>What we offer</h2>
      </div>
      <div class="grid cols-3">${servicesPreview}</div>
      <div class="center" style="margin-top:32px"><a class="btn outline" href="services.html">View all services →</a></div>
    </section>

    <section class="container center">
      <h2>${esc(c.cta.heading)}</h2>
      <p class="muted">${esc(c.cta.subheading)}</p>
      <a class="btn" href="${wa}" target="_blank" rel="noopener">Chat on WhatsApp</a>
    </section>
  </main>
  ${footerHtml(c)}
  ${waFab(c)}`;
}

function servicesPage(site: StoredSite, m: AssetMap) {
  const c = site.content;
  const items = c.services.map((s) => `
    <div class="card">
      <img src="${A(m, s.image)}" alt="${esc(s.title)}" loading="lazy" />
      <div class="body">
        <h3>${esc(s.title)}</h3>
        <p class="muted">${esc(s.description)}</p>
        <p><strong>${esc(s.price)}</strong></p>
      </div>
    </div>`).join("");
  return `${navHtml("services.html", c.brand.name, A(m, c.brand.logo), c.brand.logoHeight ?? 40)}
  <main>
    <section class="container">
      <div class="center" style="margin:32px 0">
        <span class="section-eyebrow">Services</span>
        <h1>Our <span class="hl">Services</span></h1>
      </div>
      <div class="grid cols-3">${items}</div>
    </section>
  </main>
  ${footerHtml(c)}${waFab(c)}`;
}

function galleryPage(site: StoredSite, m: AssetMap) {
  const c = site.content;
  const items = c.gallery.map((g) => `<img src="${A(m, g.image)}" alt="${esc(g.caption)}" loading="lazy" />`).join("");
  return `${navHtml("gallery.html", c.brand.name, A(m, c.brand.logo), c.brand.logoHeight ?? 40)}
  <main>
    <section class="container">
      <div class="center" style="margin:32px 0">
        <span class="section-eyebrow">Gallery</span>
        <h1>Moments we've <span class="hl">created</span></h1>
      </div>
      <div class="gallery-grid">${items}</div>
    </section>
  </main>
  ${footerHtml(c)}${waFab(c)}`;
}

function aboutPage(site: StoredSite, m: AssetMap) {
  const c = site.content;
  const stats = c.about.stats.map((s) => `<div class="stat"><div class="n">${esc(s.n)}</div><div class="l">${esc(s.l)}</div></div>`).join("");
  const steps = c.about.steps.map((s) => `
    <div class="card"><div class="body">
      <div style="font-family:'Playfair Display',serif;font-style:italic;color:var(--primary);font-size:2rem">${esc(s.num)}</div>
      <h3>${esc(s.title)}</h3>
      <p class="muted">${esc(s.text)}</p>
    </div></div>`).join("");
  const testimonials = c.testimonials.map((t) => `
    <div class="card"><div class="body">
      <p>"${esc(t.quote)}"</p>
      <p class="muted small">— ${esc(t.name)}, ${esc(t.event)}</p>
    </div></div>`).join("");
  return `${navHtml("about.html", c.brand.name, A(m, c.brand.logo), c.brand.logoHeight ?? 40)}
  <main>
    <section class="container hero">
      <div>
        <span class="badge">${esc(c.about.eyebrow)}</span>
        <h1>${esc(c.about.headingPre)}<span class="hl">${esc(c.about.headingHighlight)}</span>${esc(c.about.headingPost)}</h1>
        <p class="muted">${esc(c.about.paragraph1)}</p>
        <p class="muted">${esc(c.about.paragraph2)}</p>
        <div class="stats">${stats}</div>
      </div>
      <div class="hero-img"><img src="${A(m, c.about.image)}" alt="About ${esc(c.brand.name)}" /></div>
    </section>

    <section class="container">
      <div class="center" style="margin-bottom:32px"><span class="section-eyebrow">Process</span><h2>How we work</h2></div>
      <div class="grid cols-3">${steps}</div>
    </section>

    <section class="container">
      <div class="center" style="margin-bottom:32px"><span class="section-eyebrow">Testimonials</span><h2>Kind words</h2></div>
      <div class="grid cols-3">${testimonials}</div>
    </section>
  </main>
  ${footerHtml(c)}${waFab(c)}`;
}

function contactPage(site: StoredSite, m: AssetMap) {
  const c = site.content;
  const wa = `https://wa.me/91${c.contact.phone}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
  const faqs = c.faqs.map((f) => `
    <details class="faq"><summary>${esc(f.q)}</summary><p class="muted" style="margin-top:8px">${esc(f.a)}</p></details>`).join("");
  return `${navHtml("contact.html", c.brand.name, A(m, c.brand.logo), c.brand.logoHeight ?? 40)}
  <main>
    <section class="container">
      <div class="center" style="margin:32px 0">
        <span class="section-eyebrow">Contact</span>
        <h1>Let's <span class="hl">connect</span></h1>
      </div>
      <div class="contact-grid">
        <div>
          <p><strong>Address</strong></p><p class="muted">${esc(c.contact.address)}</p>
          <p><strong>Phone</strong></p><p class="muted">${esc(c.contact.phone)}</p>
          <p><strong>Email</strong></p><p class="muted">${esc(c.contact.email)}</p>
          <p><strong>Hours</strong></p><p class="muted">${esc(c.contact.hours)}</p>
          <div class="cta-row">
            <a class="btn" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
            <a class="btn outline" href="${esc(c.contact.mapsLink)}" target="_blank" rel="noopener">Open in Maps</a>
          </div>
        </div>
        <iframe src="${esc(c.contact.mapsEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </section>

    <section class="container">
      <div class="center" style="margin-bottom:32px"><span class="section-eyebrow">FAQ</span><h2>Common questions</h2></div>
      <div>${faqs}</div>
    </section>
  </main>
  ${footerHtml(c)}${waFab(c)}`;
}

function readmeMd(site: StoredSite) {
  return `# ${site.content.brand.name} — Static Website

Generated from the Site Builder on ${new Date().toLocaleString()}.

## What's inside
- \`index.html\`, \`services.html\`, \`gallery.html\`, \`about.html\`, \`contact.html\`
- \`styles.css\` — all styles
- \`assets/\` — images used by the site

## Hosting
This is a fully static website. Upload all files to any static host:
- **Netlify / Vercel / Cloudflare Pages**: drag the folder into a new project.
- **GitHub Pages**: push to a repo and enable Pages on \`main\`.
- **Your own server**: copy files into your web root (Nginx/Apache/S3).

No build step required.

## Custom domain
Point your domain's DNS to the host's instructions. The site uses relative
links so it works under any domain or subpath.
`;
}

export async function exportSiteAsZip(site: StoredSite): Promise<Blob> {
  const zip = new JSZip();
  const assets = await collectAssets(site, zip);
  const vars = themeStyleVars(site);

  const c = site.content;
  const baseDesc = c.brand.tagline;

  zip.file("styles.css", STYLES_CSS);
  zip.file("README.md", readmeMd(site));
  zip.file("index.html", pageShell(`${c.brand.name} — ${c.brand.tagline}`, baseDesc, indexPage(site, assets), vars));
  zip.file("services.html", pageShell(`Services — ${c.brand.name}`, `Services offered by ${c.brand.name}`, servicesPage(site, assets), vars));
  zip.file("gallery.html", pageShell(`Gallery — ${c.brand.name}`, `Gallery from ${c.brand.name}`, galleryPage(site, assets), vars));
  zip.file("about.html", pageShell(`About — ${c.brand.name}`, `About ${c.brand.name}`, aboutPage(site, assets), vars));
  zip.file("contact.html", pageShell(`Contact — ${c.brand.name}`, `Contact ${c.brand.name}`, contactPage(site, assets), vars));

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

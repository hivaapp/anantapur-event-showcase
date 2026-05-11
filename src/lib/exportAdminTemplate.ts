/* Admin panel HTML shipped inside exported static-site ZIPs.
 * Kept as a string template so it can be embedded by exportSite.ts.
 *
 * The page expects:
 *   - site-data.json sitting next to it (auto-loaded on launch)
 *   - exportRuntime.js sitting next to it (page generator)
 *   - JSZip from CDN
 */

export const ADMIN_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<title>Site Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
<script src="exportRuntime.js"></script>
<script type="application/json" id="site-data-inline">__SITE_DATA_JSON__</script>
<style>
  body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#fafaf7;color:#1c1917}
  h1,h2,h3{font-family:'Playfair Display',serif;font-style:italic}
  .field input,.field textarea{width:100%;padding:.55rem .75rem;border:1px solid #e7e5e4;border-radius:.6rem;background:white;font:inherit}
  .field textarea{min-height:5rem;resize:vertical}
  .field label{display:block;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:#78716c;margin-bottom:.3rem;font-weight:600}
  .card{background:white;border:1px solid #e7e5e4;border-radius:1.25rem;padding:1.5rem;margin-bottom:1.25rem;box-shadow:0 1px 2px rgba(0,0,0,.03)}
  .btn{padding:.6rem 1.1rem;border-radius:9999px;font-weight:600;font-size:.85rem;cursor:pointer;border:none;transition:transform .2s}
  .btn:hover{transform:translateY(-1px)}
  .btn-primary{background:#d97706;color:white}
  .btn-ghost{background:transparent;color:#78716c}
  .btn-outline{background:white;border:1px solid #e7e5e4}
  .btn-danger{background:#fee2e2;color:#991b1b}
  details summary{cursor:pointer;list-style:none;padding:.85rem 0;font-weight:600;display:flex;justify-content:space-between;align-items:center}
  details[open] summary{border-bottom:1px solid #e7e5e4;margin-bottom:.85rem}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  @media (max-width:640px){.row{grid-template-columns:1fr}}
  .thumb{width:64px;height:64px;border-radius:.6rem;background:#f5f5f4;object-fit:cover;border:1px solid #e7e5e4}
  .toast{position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);background:#1c1917;color:white;padding:.75rem 1.4rem;border-radius:9999px;font-size:.85rem;box-shadow:0 12px 24px rgba(0,0,0,.2);z-index:50;opacity:0;transition:opacity .3s}
  .toast.show{opacity:1}
</style>
</head>
<body class="min-h-screen">
<div id="gate" class="min-h-screen flex items-center justify-center px-4">
  <div class="card max-w-md w-full">
    <h1 class="text-3xl mb-1">Site admin</h1>
    <p class="text-sm text-stone-500 mb-5">Enter the passcode to manage this website.</p>
    <form id="gate-form" class="space-y-3">
      <div class="field"><label>Passcode</label><input id="gate-code" type="password" autofocus /></div>
      <p id="gate-err" class="text-xs text-red-600 hidden">Incorrect passcode.</p>
      <button class="btn btn-primary w-full" type="submit">Sign In</button>
    </form>
  </div>
</div>

<div id="app" class="hidden max-w-5xl mx-auto px-4 py-8">
  <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
    <div>
      <h1 id="title" class="text-3xl">Site admin</h1>
      <p class="text-sm text-stone-500">Edit your content, then download a fresh ZIP and re-upload to your host.</p>
    </div>
    <div class="flex gap-2">
      <button id="logout" class="btn btn-ghost">Logout</button>
      <button id="download" class="btn btn-primary">⬇ Download updated site</button>
    </div>
  </div>

  <div id="forms"></div>

  <p class="text-xs text-stone-400 mt-8 text-center">
    Tip: After downloading, replace the files on your hosting (Netlify / Vercel / GitHub Pages / your server) with the new ZIP contents. Your edits are saved in this browser automatically.
  </p>
</div>

<div id="toast" class="toast"></div>

<script>
(async function () {
  const STORAGE_KEY = "lovable_admin_site_v1";
  const SESSION_KEY = "lovable_admin_authed";
  let site = null;

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
  }

  async function loadSite() {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) { try { return JSON.parse(local); } catch {} }
    // Inline embedded data (works when opened via file://)
    const inline = document.getElementById("site-data-inline");
    if (inline && inline.textContent) {
      try { return JSON.parse(inline.textContent); } catch {}
    }
    try {
      const r = await fetch("site-data.json");
      if (r.ok) return await r.json();
    } catch {}
    return { passcode: "admin1234", content: { brand: { name: "Site" }, contact:{}, hero:{}, services:[], gallery:[], faqs:[], cta:{} } };
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
  }

  function gateInit() {
    const expected = (site && site.passcode) || "admin1234";
    if (sessionStorage.getItem(SESSION_KEY) === "1") return openApp();
    document.getElementById("gate-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const code = document.getElementById("gate-code").value;
      if (code === expected) {
        sessionStorage.setItem(SESSION_KEY, "1");
        openApp();
      } else {
        document.getElementById("gate-err").classList.remove("hidden");
      }
    });
  }

  function openApp() {
    document.getElementById("gate").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("title").textContent = (site.content.brand.name || "Site") + " — admin";
    renderForms();
  }

  // ---------- field helpers ----------
  function field(label, value, onInput, multiline) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const lab = document.createElement("label"); lab.textContent = label;
    const input = multiline ? document.createElement("textarea") : document.createElement("input");
    input.value = value ?? "";
    input.addEventListener("input", () => { onInput(input.value); persist(); });
    wrap.appendChild(lab); wrap.appendChild(input);
    return wrap;
  }

  function imageField(label, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const lab = document.createElement("label"); lab.textContent = label;
    const row = document.createElement("div");
    row.style.display = "flex"; row.style.gap = ".75rem"; row.style.alignItems = "center";
    const img = document.createElement("img");
    img.className = "thumb"; if (value) img.src = value;
    const colRight = document.createElement("div"); colRight.style.flex = "1";
    const url = document.createElement("input");
    url.value = value && value.startsWith("data:") ? "" : (value || "");
    url.placeholder = "Image URL or upload below";
    url.addEventListener("input", () => { img.src = url.value; onChange(url.value); persist(); });
    const file = document.createElement("input");
    file.type = "file"; file.accept = "image/*";
    file.style.marginTop = ".4rem"; file.style.fontSize = ".75rem";
    file.addEventListener("change", async () => {
      const f = file.files && file.files[0]; if (!f) return;
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader(); r.onload = () => res(String(r.result)); r.onerror = rej; r.readAsDataURL(f);
      });
      img.src = dataUrl; url.value = ""; onChange(dataUrl); persist();
    });
    colRight.appendChild(url); colRight.appendChild(file);
    row.appendChild(img); row.appendChild(colRight);
    wrap.appendChild(lab); wrap.appendChild(row);
    return wrap;
  }

  function section(title, body, openByDefault) {
    const d = document.createElement("details"); d.className = "card";
    if (openByDefault) d.open = true;
    const s = document.createElement("summary");
    s.innerHTML = '<span>' + title + '</span><span style="color:#a8a29e;font-weight:400">▾</span>';
    d.appendChild(s); d.appendChild(body); return d;
  }

  function listEditor(items, schema, onChange, makeNew) {
    // schema = [{key,label,type:'text'|'textarea'|'image'}]
    const wrap = document.createElement("div");
    function rerender() {
      wrap.innerHTML = "";
      items.forEach((it, idx) => {
        const card = document.createElement("div");
        card.style.cssText = "border:1px solid #e7e5e4;border-radius:.85rem;padding:.85rem;margin-bottom:.6rem";
        const head = document.createElement("div");
        head.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem";
        head.innerHTML = '<span style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#a8a29e">#' + (idx + 1) + '</span>';
        const del = document.createElement("button");
        del.className = "btn btn-danger"; del.textContent = "Remove"; del.style.padding = ".3rem .7rem"; del.style.fontSize = ".75rem";
        del.addEventListener("click", () => { items.splice(idx, 1); onChange(items); persist(); rerender(); });
        head.appendChild(del); card.appendChild(head);
        schema.forEach(sch => {
          const cb = (v) => { it[sch.key] = v; onChange(items); };
          if (sch.type === "image") card.appendChild(imageField(sch.label, it[sch.key], cb));
          else card.appendChild(field(sch.label, it[sch.key], cb, sch.type === "textarea"));
        });
        wrap.appendChild(card);
      });
      const add = document.createElement("button");
      add.className = "btn btn-outline"; add.textContent = "+ Add";
      add.addEventListener("click", () => { items.push(makeNew()); onChange(items); persist(); rerender(); });
      wrap.appendChild(add);
    }
    rerender();
    return wrap;
  }

  function uid() { return Math.random().toString(36).slice(2, 9); }

  // ---------- forms ----------
  function renderForms() {
    const root = document.getElementById("forms"); root.innerHTML = "";
    const c = site.content;

    // Brand
    const brand = document.createElement("div");
    brand.appendChild(field("Business name", c.brand.name, v => c.brand.name = v));
    brand.appendChild(field("Tagline", c.brand.tagline, v => c.brand.tagline = v, true));
    brand.appendChild(imageField("Logo (optional)", c.brand.logo || "", v => c.brand.logo = v));
    brand.appendChild(field("Logo height (px)", String(c.brand.logoHeight || 40), v => c.brand.logoHeight = Number(v) || 40));
    root.appendChild(section("Brand", brand, true));

    // Contact
    const ct = document.createElement("div");
    const r1 = document.createElement("div"); r1.className = "row";
    r1.appendChild(field("Phone (no +91)", c.contact.phone, v => c.contact.phone = v.replace(/\\D/g,"")));
    r1.appendChild(field("Email", c.contact.email, v => c.contact.email = v));
    ct.appendChild(r1);
    const r2 = document.createElement("div"); r2.className = "row";
    r2.appendChild(field("Address", c.contact.address, v => c.contact.address = v));
    r2.appendChild(field("Hours", c.contact.hours, v => c.contact.hours = v));
    ct.appendChild(r2);
    ct.appendChild(field("Instagram URL", c.contact.instagram, v => c.contact.instagram = v));
    ct.appendChild(field("WhatsApp default message", c.contact.whatsappMessage, v => c.contact.whatsappMessage = v, true));
    ct.appendChild(field("Google Maps embed URL", c.contact.mapsEmbed, v => c.contact.mapsEmbed = v, true));
    ct.appendChild(field("Google Maps link", c.contact.mapsLink, v => c.contact.mapsLink = v));
    root.appendChild(section("Contact & location", ct));

    // Hero
    const hero = document.createElement("div");
    hero.appendChild(field("Top badge", c.hero.badge, v => c.hero.badge = v));
    const hr = document.createElement("div"); hr.className = "row";
    hr.appendChild(field("Heading start", c.hero.headingPre, v => c.hero.headingPre = v));
    hr.appendChild(field("Highlight", c.hero.headingHighlight, v => c.hero.headingHighlight = v));
    hero.appendChild(hr);
    hero.appendChild(field("Heading end", c.hero.headingPost, v => c.hero.headingPost = v));
    hero.appendChild(field("Subheading", c.hero.subheading, v => c.hero.subheading = v, true));
    const hr2 = document.createElement("div"); hr2.className = "row";
    hr2.appendChild(field("Primary CTA", c.hero.ctaPrimary, v => c.hero.ctaPrimary = v));
    hr2.appendChild(field("Secondary CTA", c.hero.ctaSecondary, v => c.hero.ctaSecondary = v));
    hero.appendChild(hr2);
    hero.appendChild(imageField("Hero image", c.hero.image, v => c.hero.image = v));
    root.appendChild(section("Hero", hero));

    // Services
    const svc = listEditor(c.services, [
      { key: "title", label: "Title", type: "text" },
      { key: "price", label: "Starting price", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
    ], v => c.services = v, () => ({ id: uid(), title: "New service", price: "₹0", description: "", image: c.hero.image }));
    root.appendChild(section("Services", svc));

    // Gallery
    const gal = listEditor(c.gallery, [
      { key: "image", label: "Image", type: "image" },
      { key: "caption", label: "Caption", type: "text" },
    ], v => c.gallery = v, () => ({ id: uid(), image: c.hero.image, caption: "" }));
    root.appendChild(section("Gallery", gal));

    // FAQs
    const faq = listEditor(c.faqs, [
      { key: "q", label: "Question", type: "text" },
      { key: "a", label: "Answer", type: "textarea" },
    ], v => c.faqs = v, () => ({ id: uid(), q: "", a: "" }));
    root.appendChild(section("FAQs", faq));

    // CTA
    const cta = document.createElement("div");
    cta.appendChild(field("Heading", c.cta.heading, v => c.cta.heading = v));
    cta.appendChild(field("Subheading", c.cta.subheading, v => c.cta.subheading = v, true));
    root.appendChild(section("Closing CTA", cta));

    // Settings
    const stg = document.createElement("div");
    const pcWrap = document.createElement("div");
    pcWrap.appendChild(field("Admin passcode", site.passcode || "admin1234", v => site.passcode = v));
    stg.appendChild(pcWrap);
    const reset = document.createElement("button");
    reset.className = "btn btn-outline"; reset.style.marginTop = ".5rem"; reset.textContent = "Reset to original (discards local edits)";
    reset.addEventListener("click", async () => {
      if (!confirm("Discard all local edits and reload original content?")) return;
      localStorage.removeItem(STORAGE_KEY);
      site = await loadSite();
      renderForms();
      toast("Reset to original");
    });
    stg.appendChild(reset);
    root.appendChild(section("Settings", stg));
  }

  // ---------- export ----------
  document.getElementById("download").addEventListener("click", async () => {
    const btn = document.getElementById("download");
    btn.disabled = true; btn.textContent = "Packaging…";
    try {
      const zip = new JSZip();
      await window.LovableExport.buildAllFiles(site, zip);
      // Re-include admin so the bundle stays editable.
      const adminHtml = document.documentElement.outerHTML;
      zip.file("admin.html", adminHtml);
      const runtimeRes = await fetch("exportRuntime.js");
      zip.file("exportRuntime.js", await runtimeRes.text());
      zip.file("site-data.json", JSON.stringify(site, null, 2));
      zip.file("README.md", "Updated " + new Date().toISOString() + "\\n\\nReplace your hosted files with the contents of this ZIP.");
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = (site.brandSlug || "site") + "-website.zip";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast("ZIP downloaded");
    } catch (e) {
      console.error(e); alert("Export failed: " + e.message);
    } finally {
      btn.disabled = false; btn.textContent = "⬇ Download updated site";
    }
  });

  document.getElementById("logout").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY); location.reload();
  });

  site = await loadSite();
  gateInit();
})();
</script>
</body>
</html>
`;

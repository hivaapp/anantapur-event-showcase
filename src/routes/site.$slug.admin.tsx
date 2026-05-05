import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lock, Save, LogOut, Trash2, Power, KeyRound, ArrowLeft, Eye, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  getSite,
  updateSiteContent,
  setSiteEnabled,
  setSitePasscode,
  setSiteTheme,
  deleteSite,
  themeStyleVars,
  type StoredSite,
  DEFAULT_SITE_PASSCODE,
} from "@/lib/sitePresets";
import { ThemePicker } from "@/components/ThemePicker";
import { uid, type SiteContent, type ServiceItem, type GalleryItem, type Faq, type Stat } from "@/lib/content";

export const Route = createFileRoute("/site/$slug/admin")({
  head: () => ({
    meta: [
      { title: "Site Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SiteAdminPage,
});

function SiteAdminPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const sessionKey = `site_admin_session_${slug}`;
  const [site, setSite] = useState<StoredSite | null | undefined>(undefined);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setSite(getSite(slug));
    if (typeof window !== "undefined") {
      setAuthed(sessionStorage.getItem(sessionKey) === "1");
    }
  }, [slug, sessionKey]);

  const styleVars = useMemo(() => (site ? themeStyleVars(site) : {}), [site]);

  if (site === undefined) return <div className="min-h-dvh flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;

  if (site === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-serif italic text-marigold">404</h1>
          <p className="mt-3 text-sm text-muted-foreground">No site exists at <code className="font-mono">/site/{slug}</code>.</p>
          <Link to="/create" className="mt-6 inline-flex rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-primary-foreground">Create one</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styleVars as React.CSSProperties} className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/10 to-sky-soft/10">
      <Toaster richColors position="top-center" />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/create" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-marigold inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> All sites
          </Link>
          <div className="text-xs text-muted-foreground">
            Admin · <span className="font-mono">/site/{slug}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {authed ? (
          <SiteEditor
            site={site}
            onChange={(s) => setSite(s)}
            onLogout={() => { sessionStorage.removeItem(sessionKey); setAuthed(false); }}
            onDeleted={() => { deleteSite(slug); toast.success("Website deleted."); navigate({ to: "/create" }); }}
          />
        ) : (
          <Gate
            slug={slug}
            expected={site.passcode || DEFAULT_SITE_PASSCODE}
            onSuccess={() => { sessionStorage.setItem(sessionKey, "1"); setAuthed(true); }}
          />
        )}
      </main>
    </div>
  );
}

function Gate({ slug, expected, onSuccess }: { slug: string; expected: string; onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-8 rounded-3xl bg-card border border-border shadow-xl">
        <div className="size-14 rounded-2xl bg-marigold/10 flex items-center justify-center mb-5">
          <Lock className="size-6 text-marigold" />
        </div>
        <h1 className="text-3xl font-serif italic mb-2">Site admin</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter the passcode to manage <span className="font-mono">/site/{slug}</span>.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === expected) onSuccess();
            else setErr("Incorrect passcode.");
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="passcode">Passcode</Label>
            <Input id="passcode" type="password" value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} autoFocus className="mt-1.5" />
            {err && <p className="text-xs text-destructive mt-2">{err}</p>}
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Default passcode: <code className="px-1.5 py-0.5 rounded bg-muted">{DEFAULT_SITE_PASSCODE}</code> — change it in Settings after signing in.
          </p>
        </form>
      </div>
    </div>
  );
}

function SiteEditor({
  site,
  onChange,
  onLogout,
  onDeleted,
}: {
  site: StoredSite;
  onChange: (s: StoredSite) => void;
  onLogout: () => void;
  onDeleted: () => void;
}) {
  const [draft, setDraft] = useState<SiteContent>(site.content);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(site.content); setDirty(false); }, [site.slug]);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    updateSiteContent(site.slug, draft);
    onChange({ ...site, content: draft });
    setDirty(false);
    toast.success("Saved!");
  };

  const toggleEnabled = () => {
    const next = !(site.enabled ?? true);
    setSiteEnabled(site.slug, next);
    onChange({ ...site, enabled: next });
    toast.success(next ? "Site enabled." : "Site disabled.");
  };

  const onDelete = () => {
    if (confirm(`Delete /site/${site.slug}? This cannot be undone.`)) onDeleted();
  };

  const enabled = site.enabled ?? true;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-serif italic">{draft.brand.name}</h1>
          <p className="text-sm text-muted-foreground">
            Status: <span className={enabled ? "text-marigold font-semibold" : "text-destructive font-semibold"}>{enabled ? "Live" : "Disabled"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/site/$slug" params={{ slug: site.slug }}><Eye className="size-4" />Preview</Link>
          </Button>
          <Button onClick={onLogout} variant="ghost" size="sm"><LogOut className="size-4" />Logout</Button>
          <Button onClick={save} disabled={!dirty} size="sm" className="bg-marigold hover:bg-marigold/90">
            <Save className="size-4" />{dirty ? "Save" : "Saved"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start gap-1 bg-card border border-border p-1.5 rounded-xl">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="brand"><BrandTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="contact"><ContactTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="hero"><HeroTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="services"><ServicesTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="gallery"><GalleryTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="faqs"><FaqsTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="cta"><CtaTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="theme">
          <ThemeTab site={site} onChange={onChange} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsTab site={site} onChange={onChange} />
        </TabsContent>
      </Tabs>

      {dirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-5 py-3 rounded-full bg-foreground text-background shadow-2xl flex items-center gap-3 text-sm">
          Unsaved changes
          <button onClick={save} className="px-3 py-1 rounded-full bg-marigold text-primary-foreground text-xs font-semibold">Save</button>
        </div>
      )}
    </div>
  );
}

/* ---------- shared bits ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 p-6 rounded-2xl bg-card border border-border">
      <h2 className="text-lg font-serif italic mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function ImagePicker({ value, onChange, label = "Image" }: { value: string; onChange: (v: string) => void; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const onFile = async (f: File) => {
    if (f.size > 5_000_000) { toast.error("Image must be under 5MB."); return; }
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = reject;
      r.readAsDataURL(f);
    });
    // downscale via canvas
    const img = await new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = dataUrl; });
    const max = 1400;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d"); if (!ctx) { onChange(dataUrl); return; }
    ctx.drawImage(img, 0, 0, w, h);
    onChange(canvas.toDataURL(f.type === "image/png" ? "image/png" : "image/jpeg", 0.82));
  };
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div className="size-20 rounded-xl bg-muted overflow-hidden border border-border shrink-0">
          {value && <img src={value} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 space-y-2">
          <Input value={value.startsWith("data:") ? "" : value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL or upload" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => ref.current?.click()}>
              <Upload className="size-3.5" /> Upload
            </Button>
            <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </div>
        </div>
      </div>
    </Field>
  );
}

type TabProps = {
  draft: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
};

function BrandTab({ draft, update }: TabProps) {
  const b = draft.brand;
  const set = (p: Partial<typeof b>) => update("brand", { ...b, ...p });
  return (
    <Card title="Brand">
      <Field label="Business name"><Input value={b.name} onChange={(e) => set({ name: e.target.value })} /></Field>
      <Field label="Tagline"><Textarea value={b.tagline} onChange={(e) => set({ tagline: e.target.value })} rows={2} /></Field>
      <ImagePicker value={b.logo ?? ""} onChange={(v) => set({ logo: v })} label="Logo (optional)" />
      <Field label={`Logo height — ${b.logoHeight ?? 40}px`}>
        <input
          type="range"
          min={20}
          max={96}
          step={2}
          value={b.logoHeight ?? 40}
          onChange={(e) => set({ logoHeight: Number(e.target.value) })}
          className="w-full accent-marigold"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Recommended: transparent PNG, ~400×120px (3:1 ratio). Leave logo empty to show the business name as text.
        </p>
      </Field>
    </Card>
  );
}

function ContactTab({ draft, update }: TabProps) {
  const c = draft.contact;
  const set = (p: Partial<typeof c>) => update("contact", { ...c, ...p });
  return (
    <Card title="Contact & location">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone (no +91)"><Input value={c.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, "") })} /></Field>
        <Field label="Email"><Input value={c.email} onChange={(e) => set({ email: e.target.value })} /></Field>
        <Field label="Address"><Input value={c.address} onChange={(e) => set({ address: e.target.value })} /></Field>
        <Field label="Hours"><Input value={c.hours} onChange={(e) => set({ hours: e.target.value })} /></Field>
        <Field label="Instagram URL"><Input value={c.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
      </div>
      <Field label="Default WhatsApp message"><Textarea value={c.whatsappMessage} onChange={(e) => set({ whatsappMessage: e.target.value })} rows={2} /></Field>
      <Field label="Google Maps embed URL"><Textarea value={c.mapsEmbed} onChange={(e) => set({ mapsEmbed: e.target.value })} rows={2} /></Field>
      <Field label="Google Maps link"><Input value={c.mapsLink} onChange={(e) => set({ mapsLink: e.target.value })} /></Field>
    </Card>
  );
}

function HeroTab({ draft, update }: TabProps) {
  const h = draft.hero;
  const set = (p: Partial<typeof h>) => update("hero", { ...h, ...p });
  return (
    <>
      <Card title="Homepage hero">
        <Field label="Top badge"><Input value={h.badge} onChange={(e) => set({ badge: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Heading start"><Input value={h.headingPre} onChange={(e) => set({ headingPre: e.target.value })} /></Field>
          <Field label="Highlight"><Input value={h.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} /></Field>
          <Field label="Heading end"><Input value={h.headingPost} onChange={(e) => set({ headingPost: e.target.value })} /></Field>
        </div>
        <Field label="Subheading"><Textarea value={h.subheading} onChange={(e) => set({ subheading: e.target.value })} rows={3} /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Primary CTA"><Input value={h.ctaPrimary} onChange={(e) => set({ ctaPrimary: e.target.value })} /></Field>
          <Field label="Secondary CTA"><Input value={h.ctaSecondary} onChange={(e) => set({ ctaSecondary: e.target.value })} /></Field>
        </div>
        <ImagePicker value={h.image} onChange={(v) => set({ image: v })} label="Hero image" />
      </Card>
      <Card title="Hero stats"><StatList items={h.stats} onChange={(stats) => set({ stats })} /></Card>
    </>
  );
}

function StatList({ items, onChange }: { items: Stat[]; onChange: (v: Stat[]) => void }) {
  const upd = (id: string, p: Partial<Stat>) => onChange(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <div className="space-y-3">
      {items.map((s) => (
        <div key={s.id} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-center">
          <Input value={s.n} onChange={(e) => upd(s.id, { n: e.target.value })} placeholder="500+" />
          <Input value={s.l} onChange={(e) => upd(s.id, { l: e.target.value })} placeholder="Events" />
          <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((x) => x.id !== s.id))}><Trash2 className="size-4" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, { id: uid(), n: "", l: "" }])}><Plus className="size-4" /> Add stat</Button>
    </div>
  );
}

function ServicesTab({ draft, update }: TabProps) {
  const items = draft.services;
  const set = (next: ServiceItem[]) => update("services", next);
  const upd = (id: string, p: Partial<ServiceItem>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="Services & pricing">
      {items.map((s) => (
        <div key={s.id} className="p-4 rounded-xl border border-border space-y-3">
          <div className="flex justify-between items-start gap-3">
            <h3 className="font-serif italic text-lg">{s.title || "Untitled"}</h3>
            <Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== s.id))}><Trash2 className="size-4" /></Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title"><Input value={s.title} onChange={(e) => upd(s.id, { title: e.target.value })} /></Field>
            <Field label="Starting price"><Input value={s.price} onChange={(e) => upd(s.id, { price: e.target.value })} /></Field>
          </div>
          <Field label="Description"><Textarea value={s.description} onChange={(e) => upd(s.id, { description: e.target.value })} rows={2} /></Field>
          <ImagePicker value={s.image} onChange={(v) => upd(s.id, { image: v })} label="Image" />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), title: "", image: items[0]?.image || draft.hero.image, description: "", price: "" }])}>
        <Plus className="size-4" /> Add service
      </Button>
    </Card>
  );
}

function GalleryTab({ draft, update }: TabProps) {
  const items = draft.gallery;
  const set = (next: GalleryItem[]) => update("gallery", next);
  const upd = (id: string, p: Partial<GalleryItem>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="Gallery">
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((g) => (
          <div key={g.id} className="p-4 rounded-xl border border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Image</span>
              <Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== g.id))}><Trash2 className="size-4" /></Button>
            </div>
            <ImagePicker value={g.image} onChange={(v) => upd(g.id, { image: v })} label="" />
            <Field label="Caption"><Input value={g.caption} onChange={(e) => upd(g.id, { caption: e.target.value })} /></Field>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), image: draft.hero.image, caption: "" }])}>
        <Plus className="size-4" /> Add image
      </Button>
    </Card>
  );
}

function FaqsTab({ draft, update }: TabProps) {
  const items = draft.faqs;
  const set = (next: Faq[]) => update("faqs", next);
  const upd = (id: string, p: Partial<Faq>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="FAQs">
      {items.map((f) => (
        <div key={f.id} className="p-4 rounded-xl border border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">FAQ</span>
            <Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== f.id))}><Trash2 className="size-4" /></Button>
          </div>
          <Field label="Question"><Input value={f.q} onChange={(e) => upd(f.id, { q: e.target.value })} /></Field>
          <Field label="Answer"><Textarea value={f.a} onChange={(e) => upd(f.id, { a: e.target.value })} rows={3} /></Field>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), q: "", a: "" }])}>
        <Plus className="size-4" /> Add FAQ
      </Button>
    </Card>
  );
}

function CtaTab({ draft, update }: TabProps) {
  const c = draft.cta;
  const set = (p: Partial<typeof c>) => update("cta", { ...c, ...p });
  return (
    <Card title="Closing call-to-action">
      <Field label="Heading"><Input value={c.heading} onChange={(e) => set({ heading: e.target.value })} /></Field>
      <Field label="Subheading"><Textarea value={c.subheading} onChange={(e) => set({ subheading: e.target.value })} rows={2} /></Field>
    </Card>
  );
}

function ThemeTab({ site, onChange }: { site: StoredSite; onChange: (s: StoredSite) => void }) {
  const current = site.themeId ?? "marigold";
  return (
    <Card title="Theme color">
      <p className="text-sm text-muted-foreground -mt-1">
        Pick a palette — it instantly tints buttons, accents and backgrounds across your site. Changes save immediately.
      </p>
      <ThemePicker
        value={current}
        onChange={(id) => {
          setSiteTheme(site.slug, id);
          const updated = { ...site, themeId: id };
          // Re-fetch to pick up resolved themeOverride
          const fresh = getSite(site.slug);
          onChange(fresh ?? updated);
          toast.success("Theme updated.");
        }}
      />
    </Card>
  );
}

function SettingsTab({ site, onChange }: { site: StoredSite; onChange: (s: StoredSite) => void }) {
  const [next, setNext] = useState("");
  const [confirmCode, setConfirmCode] = useState("");

  const changePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 4) { toast.error("Passcode must be at least 4 characters."); return; }
    if (next !== confirmCode) { toast.error("Passcodes don't match."); return; }
    setSitePasscode(site.slug, next);
    onChange({ ...site, passcode: next });
    setNext(""); setConfirmCode("");
    toast.success("Passcode updated.");
  };

  return (
    <Card title="Site settings">
      <div className="text-sm">
        <p><span className="text-muted-foreground">URL:</span> <code className="font-mono">/site/{site.slug}</code></p>
        <p className="mt-1"><span className="text-muted-foreground">Created:</span> {new Date(site.createdAt).toLocaleString()}</p>
      </div>

      <form onSubmit={changePasscode} className="mt-4 p-4 rounded-xl border border-border space-y-3">
        <h3 className="text-sm font-bold inline-flex items-center gap-2"><KeyRound className="size-4" /> Change admin passcode</h3>
        <Field label="New passcode"><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        <Field label="Confirm new passcode"><Input type="password" value={confirmCode} onChange={(e) => setConfirmCode(e.target.value)} /></Field>
        <Button type="submit" size="sm">Update passcode</Button>
      </form>
    </Card>
  );
}

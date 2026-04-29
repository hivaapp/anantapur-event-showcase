import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock, Save, RotateCcw, LogOut, Plus, Trash2, Upload, Download, Eye } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  DEFAULT_CONTENT,
  uid,
  useContent,
  type SiteContent,
  type ServiceItem,
  type GalleryItem,
  type Testimonial,
  type Faq,
  type Step,
  type Stat,
} from "@/lib/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Varna Utsav" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const PASSCODE_KEY = "varna_admin_passcode_v1";
const SESSION_KEY = "varna_admin_session_v1";
const DEFAULT_PASSCODE = "varna2026";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(PASSCODE_KEY)) {
      localStorage.setItem(PASSCODE_KEY, DEFAULT_PASSCODE);
    }
    setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/10 to-sky-soft/10">
      <Header />
      <Toaster richColors position="top-center" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {authed ? <Editor onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} /> : <Gate onSuccess={() => setAuthed(true)} />}
      </main>
      <Footer />
    </div>
  );
}

function Gate({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
    if (code === stored) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setErr("Incorrect passcode.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="p-8 rounded-3xl bg-card border border-border shadow-xl">
        <div className="size-14 rounded-2xl bg-marigold/10 flex items-center justify-center mb-5">
          <Lock className="size-6 text-marigold" />
        </div>
        <h1 className="text-3xl font-serif italic mb-2">Admin Portal</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter the passcode to manage your website content.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="passcode">Passcode</Label>
            <Input id="passcode" type="password" value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} autoFocus className="mt-1.5" />
            {err && <p className="text-xs text-destructive mt-2">{err}</p>}
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
          <p className="text-[11px] text-muted-foreground text-center">
            Default passcode: <code className="px-1.5 py-0.5 rounded bg-muted">{DEFAULT_PASSCODE}</code> — change it in Settings after signing in.
          </p>
        </form>
      </div>
    </div>
  );
}

function Editor({ onLogout }: { onLogout: () => void }) {
  const { content, setContent, reset } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDraft(content); }, [content]);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    setContent(draft);
    setDirty(false);
    toast.success("Saved! Your changes are live.");
  };

  const onReset = () => {
    if (confirm("Reset ALL content to defaults? This cannot be undone.")) {
      reset();
      setDirty(false);
      toast.success("Restored to defaults.");
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(String(r.result));
        setDraft(parsed);
        setDirty(true);
        toast.success("Imported. Click Save to apply.");
      } catch {
        toast.error("Invalid JSON file.");
      }
    };
    r.readAsText(file);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-serif italic">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Edit any part of your website. Changes save to this browser.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/"><Eye className="size-4" />Preview Site</Link></Button>
          <Button onClick={exportJson} variant="outline" size="sm"><Download className="size-4" />Export</Button>
          <label className="inline-flex">
            <Button asChild variant="outline" size="sm"><span className="cursor-pointer"><Upload className="size-4" />Import</span></Button>
            <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
          </label>
          <Button onClick={onReset} variant="outline" size="sm"><RotateCcw className="size-4" />Reset</Button>
          <Button onClick={onLogout} variant="ghost" size="sm"><LogOut className="size-4" />Logout</Button>
          <Button onClick={save} disabled={!dirty} size="sm" className="bg-marigold hover:bg-marigold/90">
            <Save className="size-4" />{dirty ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="flex flex-wrap h-auto justify-start gap-1 bg-card border border-border p-1.5 rounded-xl">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Highlights</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="brand"><BrandTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="contact"><ContactTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="hero"><HeroTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="features"><FeaturesTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="services"><ServicesTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="gallery"><GalleryTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="testimonials"><TestimonialsTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="faqs"><FaqsTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="about"><AboutTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="cta"><CtaTab draft={draft} update={update} /></TabsContent>
        <TabsContent value="settings"><SettingsTab /></TabsContent>
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

/* ========== Reusable bits ========== */

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
  const onFile = (f: File) => {
    if (f.size > 3_000_000) { toast.error("Image must be under 3MB."); return; }
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(f);
  };
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div className="size-20 rounded-xl bg-muted overflow-hidden border border-border shrink-0">
          {value && <img src={value} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1 space-y-2">
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL or upload" />
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

/* ========== Tabs ========== */

type TabProps = {
  draft: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
};

function BrandTab({ draft, update }: TabProps) {
  const b = draft.brand;
  const set = (patch: Partial<typeof b>) => update("brand", { ...b, ...patch });
  return (
    <Card title="Brand identity">
      <Field label="Business name (used in header, footer, page titles)"><Input value={b.name} onChange={(e) => set({ name: e.target.value })} /></Field>
      <Field label="Tagline (footer)"><Textarea value={b.tagline} onChange={(e) => set({ tagline: e.target.value })} rows={2} /></Field>
    </Card>
  );
}

function ContactTab({ draft, update }: TabProps) {
  const c = draft.contact;
  const set = (patch: Partial<typeof c>) => update("contact", { ...c, ...patch });
  return (
    <Card title="Contact & location">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone / WhatsApp number (no +91)"><Input value={c.phone} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, "") })} /></Field>
        <Field label="Email"><Input value={c.email} onChange={(e) => set({ email: e.target.value })} /></Field>
        <Field label="Address"><Input value={c.address} onChange={(e) => set({ address: e.target.value })} /></Field>
        <Field label="Business hours"><Input value={c.hours} onChange={(e) => set({ hours: e.target.value })} /></Field>
        <Field label="Instagram URL"><Input value={c.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
      </div>
      <Field label="Default WhatsApp message"><Textarea value={c.whatsappMessage} onChange={(e) => set({ whatsappMessage: e.target.value })} rows={2} /></Field>
      <Field label="Google Maps embed URL (use the embed src from Google Maps → Share → Embed)"><Textarea value={c.mapsEmbed} onChange={(e) => set({ mapsEmbed: e.target.value })} rows={2} /></Field>
      <Field label="Google Maps link (Open in Maps button)"><Input value={c.mapsLink} onChange={(e) => set({ mapsLink: e.target.value })} /></Field>
    </Card>
  );
}

function HeroTab({ draft, update }: TabProps) {
  const h = draft.hero;
  const set = (patch: Partial<typeof h>) => update("hero", { ...h, ...patch });
  return (
    <>
      <Card title="Homepage hero">
        <Field label="Top badge"><Input value={h.badge} onChange={(e) => set({ badge: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Heading (start)"><Input value={h.headingPre} onChange={(e) => set({ headingPre: e.target.value })} /></Field>
          <Field label="Highlighted word"><Input value={h.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} /></Field>
          <Field label="Heading (end)"><Input value={h.headingPost} onChange={(e) => set({ headingPost: e.target.value })} /></Field>
        </div>
        <Field label="Subheading"><Textarea value={h.subheading} onChange={(e) => set({ subheading: e.target.value })} rows={3} /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Primary CTA text"><Input value={h.ctaPrimary} onChange={(e) => set({ ctaPrimary: e.target.value })} /></Field>
          <Field label="Secondary CTA text"><Input value={h.ctaSecondary} onChange={(e) => set({ ctaSecondary: e.target.value })} /></Field>
        </div>
        <ImagePicker value={h.image} onChange={(v) => set({ image: v })} label="Hero image" />
      </Card>
      <Card title="Hero stats">
        <StatList items={h.stats} onChange={(stats) => set({ stats })} />
      </Card>
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

function FeaturesTab({ draft, update }: TabProps) {
  const items = draft.features;
  const set = (next: typeof items) => update("features", next);
  const upd = (id: string, p: Partial<(typeof items)[number]>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="Why-us highlights (3 cards on homepage)">
      {items.map((f) => (
        <div key={f.id} className="p-4 rounded-xl border border-border space-y-3">
          <div className="grid sm:grid-cols-[140px_1fr_auto] gap-2 items-end">
            <Field label="Icon">
              <select className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm" value={f.icon} onChange={(e) => upd(f.id, { icon: e.target.value as any })}>
                <option value="Heart">Heart</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Award">Award</option>
              </select>
            </Field>
            <Field label="Title"><Input value={f.title} onChange={(e) => upd(f.id, { title: e.target.value })} /></Field>
            <Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== f.id))}><Trash2 className="size-4" /></Button>
          </div>
          <Field label="Description"><Textarea value={f.text} onChange={(e) => upd(f.id, { text: e.target.value })} rows={2} /></Field>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), icon: "Sparkles", title: "", text: "" }])}><Plus className="size-4" /> Add highlight</Button>
    </Card>
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
            <Field label="Starting price"><Input value={s.price} onChange={(e) => upd(s.id, { price: e.target.value })} placeholder="₹45,000" /></Field>
          </div>
          <Field label="Description"><Textarea value={s.description} onChange={(e) => upd(s.id, { description: e.target.value })} rows={3} /></Field>
          <ImagePicker value={s.image} onChange={(v) => upd(s.id, { image: v })} />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), title: "New Service", description: "", price: "₹0", image: "" }])}><Plus className="size-4" /> Add service</Button>
    </Card>
  );
}

function GalleryTab({ draft, update }: TabProps) {
  const items = draft.gallery;
  const set = (next: GalleryItem[]) => update("gallery", next);
  const upd = (id: string, p: Partial<GalleryItem>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="Gallery">
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((g) => (
          <div key={g.id} className="p-4 rounded-xl border border-border space-y-3">
            <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== g.id))}><Trash2 className="size-4" /></Button></div>
            <ImagePicker value={g.image} onChange={(v) => upd(g.id, { image: v })} />
            <Field label="Caption"><Input value={g.caption} onChange={(e) => upd(g.id, { caption: e.target.value })} /></Field>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), image: "", caption: "" }])}><Plus className="size-4" /> Add image</Button>
    </Card>
  );
}

function TestimonialsTab({ draft, update }: TabProps) {
  const items = draft.testimonials;
  const set = (next: Testimonial[]) => update("testimonials", next);
  const upd = (id: string, p: Partial<Testimonial>) => set(items.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <Card title="Testimonials">
      {items.map((t) => (
        <div key={t.id} className="p-4 rounded-xl border border-border space-y-3">
          <div className="grid sm:grid-cols-[1fr_1fr_120px_auto] gap-2 items-end">
            <Field label="Name"><Input value={t.name} onChange={(e) => upd(t.id, { name: e.target.value })} /></Field>
            <Field label="Event"><Input value={t.event} onChange={(e) => upd(t.id, { event: e.target.value })} /></Field>
            <Field label="Rating (1-5)"><Input type="number" min={1} max={5} value={t.rating} onChange={(e) => upd(t.id, { rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })} /></Field>
            <Button variant="ghost" size="icon" onClick={() => set(items.filter((x) => x.id !== t.id))}><Trash2 className="size-4" /></Button>
          </div>
          <Field label="Quote"><Textarea value={t.quote} onChange={(e) => upd(t.id, { quote: e.target.value })} rows={3} /></Field>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), name: "", event: "", quote: "", rating: 5 }])}><Plus className="size-4" /> Add testimonial</Button>
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
          <div className="flex justify-between items-start gap-3">
            <Field label="Question"><Input value={f.q} onChange={(e) => upd(f.id, { q: e.target.value })} /></Field>
            <Button variant="ghost" size="icon" className="mt-6" onClick={() => set(items.filter((x) => x.id !== f.id))}><Trash2 className="size-4" /></Button>
          </div>
          <Field label="Answer"><Textarea value={f.a} onChange={(e) => upd(f.id, { a: e.target.value })} rows={3} /></Field>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => set([...items, { id: uid(), q: "", a: "" }])}><Plus className="size-4" /> Add FAQ</Button>
    </Card>
  );
}

function AboutTab({ draft, update }: TabProps) {
  const a = draft.about;
  const set = (patch: Partial<typeof a>) => update("about", { ...a, ...patch });
  const setSteps = (steps: Step[]) => set({ steps });
  const updStep = (id: string, p: Partial<Step>) => setSteps(a.steps.map((x) => (x.id === id ? { ...x, ...p } : x)));
  return (
    <>
      <Card title="About page">
        <Field label="Eyebrow"><Input value={a.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Heading (start)"><Input value={a.headingPre} onChange={(e) => set({ headingPre: e.target.value })} /></Field>
          <Field label="Highlighted word"><Input value={a.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} /></Field>
          <Field label="Heading (end)"><Input value={a.headingPost} onChange={(e) => set({ headingPost: e.target.value })} /></Field>
        </div>
        <Field label="Paragraph 1"><Textarea value={a.paragraph1} onChange={(e) => set({ paragraph1: e.target.value })} rows={4} /></Field>
        <Field label="Paragraph 2"><Textarea value={a.paragraph2} onChange={(e) => set({ paragraph2: e.target.value })} rows={4} /></Field>
        <ImagePicker value={a.image} onChange={(v) => set({ image: v })} label="About image" />
      </Card>
      <Card title="About stats">
        <StatList items={a.stats} onChange={(stats) => set({ stats })} />
      </Card>
      <Card title="How we work (steps)">
        {a.steps.map((s) => (
          <div key={s.id} className="p-4 rounded-xl border border-border space-y-3">
            <div className="grid sm:grid-cols-[100px_1fr_auto] gap-2 items-end">
              <Field label="Number"><Input value={s.num} onChange={(e) => updStep(s.id, { num: e.target.value })} /></Field>
              <Field label="Title"><Input value={s.title} onChange={(e) => updStep(s.id, { title: e.target.value })} /></Field>
              <Button variant="ghost" size="icon" onClick={() => setSteps(a.steps.filter((x) => x.id !== s.id))}><Trash2 className="size-4" /></Button>
            </div>
            <Field label="Description"><Textarea value={s.text} onChange={(e) => updStep(s.id, { text: e.target.value })} rows={2} /></Field>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setSteps([...a.steps, { id: uid(), num: "", title: "", text: "" }])}><Plus className="size-4" /> Add step</Button>
      </Card>
    </>
  );
}

function CtaTab({ draft, update }: TabProps) {
  const c = draft.cta;
  const set = (patch: Partial<typeof c>) => update("cta", { ...c, ...patch });
  return (
    <Card title="Bottom call-to-action banner">
      <Field label="Heading"><Input value={c.heading} onChange={(e) => set({ heading: e.target.value })} /></Field>
      <Field label="Subheading"><Textarea value={c.subheading} onChange={(e) => set({ subheading: e.target.value })} rows={2} /></Field>
    </Card>
  );
}

function SettingsTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");

  const change = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem(PASSCODE_KEY) || DEFAULT_PASSCODE;
    if (current !== stored) return toast.error("Current passcode is incorrect.");
    if (next.length < 4) return toast.error("New passcode must be at least 4 characters.");
    if (next !== next2) return toast.error("Passcodes do not match.");
    localStorage.setItem(PASSCODE_KEY, next);
    setCurrent(""); setNext(""); setNext2("");
    toast.success("Passcode updated.");
  };

  return (
    <Card title="Admin passcode">
      <p className="text-sm text-muted-foreground">Note: the passcode is stored in this browser. Anyone with browser access can view it. For stronger security, switch to email login later.</p>
      <form onSubmit={change} className="space-y-3 max-w-sm">
        <Field label="Current passcode"><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></Field>
        <Field label="New passcode"><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        <Field label="Confirm new passcode"><Input type="password" value={next2} onChange={(e) => setNext2(e.target.value)} /></Field>
        <Button type="submit">Update passcode</Button>
      </form>
    </Card>
  );
}

// silence unused warning for DEFAULT_CONTENT export usage in this file
void DEFAULT_CONTENT;

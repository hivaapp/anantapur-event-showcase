import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Sparkles, Wand2, Plus, Trash2, Power, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TYPES, type SiteType, buildSiteContent, saveSite, uniqueSlug, loadSites, deleteSite, setSiteEnabled, type StoredSite } from "@/lib/sitePresets";
import type { SiteContent, ServiceItem, Faq, GalleryItem } from "@/lib/content";
import { uid } from "@/lib/content";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ImageUpload } from "@/components/ImageUpload";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Website — Site Builder" },
      { name: "description", content: "Generate a beautiful website in seconds. Pick your business type, edit details and content, and we'll build the rest." },
    ],
  }),
  component: CreatePage,
});

const schema = z.object({
  type: z.enum(["event", "jewellery", "photography", "realestate", "hospital", "custom"]),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  tagline: z.string().trim().max(120).optional(),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  whatsappMessage: z.string().trim().max(200).optional(),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  address: z.string().trim().min(3, "Address required").max(200),
  hours: z.string().trim().max(100).optional(),
  instagram: z.string().trim().url("Invalid URL").max(200).optional().or(z.literal("")),
});

function CreatePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<SiteType | null>(null);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    phone: "",
    whatsappMessage: "",
    email: "",
    address: "",
    hours: "",
    instagram: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<SiteContent | null>(null);

  const [sites, setSites] = useState<StoredSite[]>([]);
  const refreshSites = () => setSites(Object.values(loadSites()).sort((a, b) => b.createdAt - a.createdAt));
  useEffect(() => { refreshSites(); }, []);

  function pickType(t: SiteType) {
    setType(t);
    setStep(2);
  }

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleProceed(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;
    const result = schema.safeParse({ type, ...form });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errs[issue.path.join(".")] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the errors below.");
      return;
    }
    setErrors({});
    const content = buildSiteContent(result.data);
    setDraft(content);
    setStep(3);
  }

  function handleCreate() {
    if (!type || !draft) return;
    const slug = uniqueSlug(draft.brand.name);
    saveSite({ slug, type, createdAt: Date.now(), content: draft });
    toast.success("Website created!");
    navigate({ to: "/site/$slug", params: { slug } });
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background via-rose-soft/10 to-sky-soft/10">
      <Toaster richColors position="top-center" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-serif italic font-bold text-marigold inline-flex items-center gap-2">
            <Wand2 className="size-4" /> Site Builder
          </Link>
          <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-marigold">
            ← Back to template
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-12 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-marigold/10 border border-marigold/20 rounded-full text-marigold text-xs font-bold uppercase tracking-widest mb-5">
            <Sparkles className="size-3.5" /> Instant Website Builder
          </div>
          <h1 className="text-4xl lg:text-6xl font-serif italic leading-tight mb-4">
            Create your <span className="text-shine">beautiful</span> website
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Pick your business type, fill in your details, edit the content, and launch in seconds.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10 text-xs font-bold uppercase tracking-widest flex-wrap">
          <span className={step === 1 ? "text-marigold" : "text-muted-foreground"}>① Pick Type</span>
          <span className="text-muted-foreground">—</span>
          <span className={step === 2 ? "text-marigold" : "text-muted-foreground"}>② Your Details</span>
          <span className="text-muted-foreground">—</span>
          <span className={step === 3 ? "text-marigold" : "text-muted-foreground"}>③ Edit & Launch</span>
        </div>

        {step === 1 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(TYPES).map((t) => (
              <button
                key={t.id}
                onClick={() => pickType(t.id)}
                className="group text-left p-7 rounded-3xl bg-card border border-border hover:border-marigold/60 hover:shadow-xl hover:shadow-marigold/10 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="text-4xl mb-3">{t.emoji}</div>
                <h3 className="text-xl font-serif italic mb-1 group-hover:text-marigold transition-colors">{t.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-marigold uppercase tracking-widest">
                  Choose <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && type && (
          <form onSubmit={handleProceed} className="max-w-2xl mx-auto space-y-6 bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-xl">
            <div className="flex items-center justify-between pb-5 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{TYPES[type].emoji}</span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Building a</p>
                  <p className="text-lg font-serif italic">{TYPES[type].label} site</p>
                </div>
              </div>
              <button type="button" onClick={() => setStep(1)} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-marigold inline-flex items-center gap-1">
                <ArrowLeft className="size-3.5" /> Change
              </button>
            </div>

            <Field label="Business Name" name="name" error={errors.name}>
              <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Sri Lakshmi Jewellers" maxLength={60} />
            </Field>

            <Field label="Tagline (optional)" name="tagline" error={errors.tagline}>
              <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="e.g. Heritage gold, modern designs" maxLength={120} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Phone (10 digits)" name="phone" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" inputMode="numeric" />
              </Field>
              <Field label="Email (optional)" name="email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="hello@brand.com" maxLength={120} />
              </Field>
            </div>

            <Field label="Address / Location" name="address" error={errors.address}>
              <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Main Road, Anantapur, Andhra Pradesh" rows={2} maxLength={200} />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Working Hours" name="hours" error={errors.hours}>
                <Input value={form.hours} onChange={(e) => update("hours", e.target.value)} placeholder="Mon–Sun · 10 AM – 9 PM" maxLength={100} />
              </Field>
              <Field label="Instagram URL (optional)" name="instagram" error={errors.instagram}>
                <Input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/yourbrand" maxLength={200} />
              </Field>
            </div>

            <Field label="WhatsApp default message (optional)" name="whatsappMessage" error={errors.whatsappMessage}>
              <Input value={form.whatsappMessage} onChange={(e) => update("whatsappMessage", e.target.value)} placeholder="Hi! I'd like to know more." maxLength={200} />
            </Field>

            <p className="text-xs text-muted-foreground">
              Next: you'll see <strong>{TYPES[type].label}</strong>-specific services and content auto-filled — you can edit everything before creating.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="bg-marigold hover:bg-marigold/90 text-primary-foreground rounded-full px-8">
                Continue to Edit <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="rounded-full">
                Back
              </Button>
            </div>
          </form>
        )}

        {step === 3 && type && draft && (
          <EditStep
            type={type}
            draft={draft}
            setDraft={setDraft}
            onBack={() => setStep(2)}
            onCreate={handleCreate}
          />
        )}

        {sites.length > 0 && step === 1 && (
          <div className="mt-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Your generated sites</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((s) => {
                const enabled = s.enabled ?? true;
                return (
                  <div
                    key={s.slug}
                    className="p-5 rounded-2xl bg-card border border-border hover:border-marigold/60 transition-all flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-2xl">{TYPES[s.type].emoji}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${enabled ? "bg-marigold/15 text-marigold" : "bg-destructive/15 text-destructive"}`}>
                        {enabled ? "Live" : "Disabled"}
                      </span>
                    </div>
                    <p className="font-serif italic text-lg">{s.content.brand.name}</p>
                    <p className="text-xs text-muted-foreground truncate mb-3">/site/{s.slug}</p>
                    <p className="text-[11px] text-muted-foreground mb-4">{new Date(s.createdAt).toLocaleDateString()}</p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                        <Link to="/site/$slug" params={{ slug: s.slug }}>
                          <ExternalLink className="size-3.5" /> View
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="rounded-full text-xs">
                        <Link to="/site/$slug/admin" params={{ slug: s.slug }}>
                          <Settings className="size-3.5" /> Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs"
                        onClick={() => {
                          setSiteEnabled(s.slug, !enabled);
                          refreshSites();
                          toast.success(enabled ? "Disabled" : "Enabled");
                        }}
                      >
                        <Power className="size-3.5" /> {enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs text-destructive hover:text-destructive"
                        onClick={() => {
                          if (!confirm(`Delete /site/${s.slug}? This cannot be undone.`)) return;
                          deleteSite(s.slug);
                          refreshSites();
                          toast.success("Website deleted.");
                        }}
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function EditStep({
  type,
  draft,
  setDraft,
  onBack,
  onCreate,
}: {
  type: SiteType;
  draft: SiteContent;
  setDraft: (c: SiteContent) => void;
  onBack: () => void;
  onCreate: () => void;
}) {
  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft({ ...draft, [key]: value });
  }
  function patchHero(partial: Partial<SiteContent["hero"]>) {
    setDraft({ ...draft, hero: { ...draft.hero, ...partial } });
  }
  function patchCta(partial: Partial<SiteContent["cta"]>) {
    setDraft({ ...draft, cta: { ...draft.cta, ...partial } });
  }

  function updateService(id: string, partial: Partial<ServiceItem>) {
    patch("services", draft.services.map((s) => (s.id === id ? { ...s, ...partial } : s)));
  }
  function addService() {
    patch("services", [
      ...draft.services,
      { id: uid(), title: "New Service", image: draft.services[0]?.image ?? draft.hero.image, description: "Describe this service.", price: "₹0" },
    ]);
  }
  function removeService(id: string) {
    patch("services", draft.services.filter((s) => s.id !== id));
  }

  function updateFaq(id: string, partial: Partial<Faq>) {
    patch("faqs", draft.faqs.map((f) => (f.id === id ? { ...f, ...partial } : f)));
  }
  function addFaq() {
    patch("faqs", [...draft.faqs, { id: uid(), q: "New question?", a: "Answer here." }]);
  }
  function removeFaq(id: string) {
    patch("faqs", draft.faqs.filter((f) => f.id !== id));
  }

  function updateGallery(id: string, partial: Partial<GalleryItem>) {
    patch("gallery", draft.gallery.map((g) => (g.id === id ? { ...g, ...partial } : g)));
  }
  function addGallery() {
    patch("gallery", [...draft.gallery, { id: uid(), image: draft.hero.image, caption: "New image" }]);
  }
  function removeGallery(id: string) {
    patch("gallery", draft.gallery.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-3xl p-6 lg:p-8 shadow-xl">
        <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{TYPES[type].emoji}</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Editing</p>
              <p className="text-lg font-serif italic">{draft.brand.name}</p>
            </div>
          </div>
          <button type="button" onClick={onBack} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-marigold inline-flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Edit details
          </button>
        </div>

        <SectionTitle>Brand</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Field label="Name" name="brandName">
            <Input value={draft.brand.name} onChange={(e) => patch("brand", { ...draft.brand, name: e.target.value })} maxLength={60} />
          </Field>
          <Field label="Tagline" name="brandTagline">
            <Input value={draft.brand.tagline} onChange={(e) => patch("brand", { ...draft.brand, tagline: e.target.value })} maxLength={120} />
          </Field>
        </div>

        <SectionTitle>Hero</SectionTitle>
        <div className="space-y-4 mb-8">
          <div className="grid md:grid-cols-[1fr_280px] gap-4 items-start">
            <div className="space-y-4">
              <Field label="Badge" name="heroBadge">
                <Input value={draft.hero.badge} onChange={(e) => patchHero({ badge: e.target.value })} maxLength={60} />
              </Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Heading — before" name="heroPre">
                  <Input value={draft.hero.headingPre} onChange={(e) => patchHero({ headingPre: e.target.value })} maxLength={40} />
                </Field>
                <Field label="Heading — highlight" name="heroHl">
                  <Input value={draft.hero.headingHighlight} onChange={(e) => patchHero({ headingHighlight: e.target.value })} maxLength={40} />
                </Field>
                <Field label="Heading — after" name="heroPost">
                  <Input value={draft.hero.headingPost} onChange={(e) => patchHero({ headingPost: e.target.value })} maxLength={40} />
                </Field>
              </div>
            </div>
            <ImageUpload
              label="Hero banner image"
              value={draft.hero.image}
              onChange={(url) => patchHero({ image: url })}
              aspect="aspect-[4/5]"
            />
          </div>
          <Field label="Subheading" name="heroSub">
            <Textarea value={draft.hero.subheading} onChange={(e) => patchHero({ subheading: e.target.value })} rows={3} maxLength={300} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Primary CTA" name="ctaPri">
              <Input value={draft.hero.ctaPrimary} onChange={(e) => patchHero({ ctaPrimary: e.target.value })} maxLength={30} />
            </Field>
            <Field label="Secondary CTA" name="ctaSec">
              <Input value={draft.hero.ctaSecondary} onChange={(e) => patchHero({ ctaSecondary: e.target.value })} maxLength={30} />
            </Field>
          </div>
        </div>

        <SectionTitle>
          Services / Offerings
          <Button type="button" size="sm" variant="outline" onClick={addService} className="ml-auto rounded-full">
            <Plus className="size-3.5 mr-1" /> Add
          </Button>
        </SectionTitle>
        <div className="space-y-4 mb-8">
          {draft.services.map((s, i) => (
            <div key={s.id} className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">#{i + 1}</span>
                <button type="button" onClick={() => removeService(s.id)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1">
                  <Trash2 className="size-3.5" /> Remove
                </button>
              </div>
              <div className="grid md:grid-cols-[200px_1fr] gap-4">
                <ImageUpload
                  label="Service image"
                  value={s.image}
                  onChange={(url) => updateService(s.id, { image: url })}
                  aspect="aspect-square"
                />
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Title" name={`s-title-${s.id}`}>
                      <Input value={s.title} onChange={(e) => updateService(s.id, { title: e.target.value })} maxLength={60} />
                    </Field>
                    <Field label="Starting price" name={`s-price-${s.id}`}>
                      <Input value={s.price} onChange={(e) => updateService(s.id, { price: e.target.value })} maxLength={30} />
                    </Field>
                  </div>
                  <Field label="Description" name={`s-desc-${s.id}`}>
                    <Textarea value={s.description} onChange={(e) => updateService(s.id, { description: e.target.value })} rows={2} maxLength={240} />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          {draft.services.length === 0 && <p className="text-sm text-muted-foreground">No services yet. Add one above.</p>}
        </div>

        <SectionTitle>
          Gallery
          <Button type="button" size="sm" variant="outline" onClick={addGallery} className="ml-auto rounded-full">
            <Plus className="size-3.5 mr-1" /> Add
          </Button>
        </SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {draft.gallery.map((g, i) => (
            <div key={g.id} className="p-3 rounded-2xl border border-border bg-background/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">#{i + 1}</span>
                <button type="button" onClick={() => removeGallery(g.id)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <ImageUpload
                label="Gallery image"
                value={g.image}
                onChange={(url) => updateGallery(g.id, { image: url })}
                aspect="aspect-square"
              />
              <Field label="Caption" name={`g-c-${g.id}`}>
                <Input value={g.caption} onChange={(e) => updateGallery(g.id, { caption: e.target.value })} maxLength={80} />
              </Field>
            </div>
          ))}
          {draft.gallery.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No gallery images yet. Add one above.</p>}
        </div>

        <SectionTitle>
          FAQs
          <Button type="button" size="sm" variant="outline" onClick={addFaq} className="ml-auto rounded-full">
            <Plus className="size-3.5 mr-1" /> Add
          </Button>
        </SectionTitle>
        <div className="space-y-3 mb-8">
          {draft.faqs.map((f, i) => (
            <div key={f.id} className="p-4 rounded-2xl border border-border bg-background/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">#{i + 1}</span>
                <button type="button" onClick={() => removeFaq(f.id)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1">
                  <Trash2 className="size-3.5" /> Remove
                </button>
              </div>
              <Field label="Question" name={`f-q-${f.id}`}>
                <Input value={f.q} onChange={(e) => updateFaq(f.id, { q: e.target.value })} maxLength={140} />
              </Field>
              <Field label="Answer" name={`f-a-${f.id}`}>
                <Textarea value={f.a} onChange={(e) => updateFaq(f.id, { a: e.target.value })} rows={2} maxLength={400} />
              </Field>
            </div>
          ))}
        </div>

        <SectionTitle>Closing CTA</SectionTitle>
        <div className="space-y-4">
          <Field label="Heading" name="ctaHead">
            <Input value={draft.cta.heading} onChange={(e) => patchCta({ heading: e.target.value })} maxLength={80} />
          </Field>
          <Field label="Subheading" name="ctaSub">
            <Textarea value={draft.cta.subheading} onChange={(e) => patchCta({ subheading: e.target.value })} rows={2} maxLength={240} />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-end sticky bottom-4 bg-background/80 backdrop-blur-xl border border-border rounded-full px-4 py-3 shadow-xl">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="rounded-full">
          <ArrowLeft className="size-4 mr-1" /> Back
        </Button>
        <Button type="button" size="lg" onClick={onCreate} className="bg-marigold hover:bg-marigold/90 text-primary-foreground rounded-full px-8">
          Create Website <ArrowRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-xs uppercase tracking-widest font-bold text-marigold">{children}</h3>
    </div>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

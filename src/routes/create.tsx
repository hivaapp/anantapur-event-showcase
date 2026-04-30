import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TYPES, type SiteType, buildSiteContent, saveSite, uniqueSlug, loadSites } from "@/lib/sitePresets";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create a Website — Site Builder" },
      { name: "description", content: "Generate a beautiful website in seconds. Pick your business type, add your details, and we'll build the rest." },
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
  const [step, setStep] = useState<1 | 2>(1);
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

  const sites = typeof window !== "undefined" ? Object.values(loadSites()) : [];

  function pickType(t: SiteType) {
    setType(t);
    setStep(2);
  }

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function handleCreate(e: React.FormEvent) {
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
    const slug = uniqueSlug(result.data.name);
    const content = buildSiteContent(result.data);
    saveSite({ slug, type, createdAt: Date.now(), content });
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
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-marigold/10 border border-marigold/20 rounded-full text-marigold text-xs font-bold uppercase tracking-widest mb-5">
            <Sparkles className="size-3.5" /> Instant Website Builder
          </div>
          <h1 className="text-4xl lg:text-6xl font-serif italic leading-tight mb-4">
            Create your <span className="text-shine">beautiful</span> website
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground">
            Pick your business type, fill in your details, and we'll build a fully-designed site for you in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs font-bold uppercase tracking-widest">
          <span className={step === 1 ? "text-marigold" : "text-muted-foreground"}>① Pick Type</span>
          <span className="text-muted-foreground">—</span>
          <span className={step === 2 ? "text-marigold" : "text-muted-foreground"}>② Your Details</span>
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
          <form onSubmit={handleCreate} className="max-w-2xl mx-auto space-y-6 bg-card border border-border rounded-3xl p-8 lg:p-10 shadow-xl">
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

            <div className="pt-3 flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="bg-marigold hover:bg-marigold/90 text-primary-foreground rounded-full px-8">
                Create Website <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="rounded-full">
                Back
              </Button>
            </div>
          </form>
        )}

        {/* Existing sites */}
        {sites.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4">Your generated sites</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sites.map((s) => (
                <Link
                  key={s.slug}
                  to="/site/$slug"
                  params={{ slug: s.slug }}
                  className="block p-5 rounded-2xl bg-card border border-border hover:border-marigold/60 hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{TYPES[s.type].emoji}</span>
                    <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-serif italic text-lg">{s.content.brand.name}</p>
                  <p className="text-xs text-muted-foreground truncate">/site/{s.slug}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
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

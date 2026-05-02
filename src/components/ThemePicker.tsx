import { THEME_PALETTES } from "@/lib/sitePresets";
import { Check } from "lucide-react";

export function ThemePicker({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-3 sm:grid-cols-5 gap-3 ${className ?? ""}`}>
      {THEME_PALETTES.map((p) => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
              active ? "border-marigold ring-2 ring-marigold/30 bg-marigold/5" : "border-border hover:border-marigold/40 bg-card"
            }`}
            aria-pressed={active}
          >
            <span
              className="size-10 rounded-full shadow-md ring-1 ring-black/5"
              style={{ background: p.swatch }}
            />
            <span className="text-[11px] font-semibold tracking-wide text-foreground">{p.label}</span>
            {active && (
              <span className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-marigold text-primary-foreground">
                <Check className="size-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

async function fileToDataUrl(file: File, maxDim = 1400, quality = 0.82): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  // Downscale via canvas to keep localStorage small
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mime, quality);
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspect = "aspect-video",
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      onChange(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className={`relative ${aspect} rounded-xl overflow-hidden border border-border bg-muted group`}>
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-2 px-3 py-2 bg-white text-black rounded-full text-xs font-semibold">
            <Upload className="size-3.5" /> {busy ? "Uploading…" : "Replace"}
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="absolute top-2 right-2 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-[11px] text-marigold font-semibold hover:underline inline-flex items-center gap-1"
        >
          <Upload className="size-3" /> Upload
        </button>
      </div>
    </div>
  );
}

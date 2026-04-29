import { MessageCircle, Phone } from "lucide-react";
import { useContacts } from "@/lib/content";

export function FloatingActions() {
  const { TEL_URL, WHATSAPP_URL } = useContacts();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="group flex items-center gap-2 bg-emerald-500 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform animate-pulse-slow"
      >
        <MessageCircle className="size-5" />
        <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
      </a>
      <a
        href={TEL_URL}
        aria-label="Call"
        className="flex items-center gap-2 bg-foreground text-background pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:scale-105 transition-transform"
      >
        <Phone className="size-5" />
        <span className="text-sm font-semibold hidden sm:inline">Call</span>
      </a>
    </div>
  );
}

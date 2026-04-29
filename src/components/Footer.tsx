import { Link } from "@tanstack/react-router";
import { Phone, MessageCircle, MapPin, Instagram } from "lucide-react";
import { useContacts, useContent } from "@/lib/content";

export function Footer() {
  const { PHONE, TEL_URL, WHATSAPP_URL, mapsLink, address, instagram } = useContacts();
  const { content } = useContent();

  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-serif italic text-3xl text-marigold mb-4">{content.brand.name}</h3>
          <p className="text-background/60 text-sm leading-relaxed max-w-md">
            {content.brand.tagline}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-marigold mb-4">Explore</p>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link to="/services" className="hover:text-marigold">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-marigold">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-marigold">About</Link></li>
            <li><Link to="/contact" className="hover:text-marigold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-marigold mb-4">Reach Us</p>
          <ul className="space-y-3 text-sm text-background/70">
            <li><a href={TEL_URL} className="flex items-center gap-2 hover:text-marigold"><Phone className="size-4" />+91 {PHONE}</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-marigold"><MessageCircle className="size-4" />WhatsApp</a></li>
            <li><a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-marigold"><MapPin className="size-4" />{address}</a></li>
            <li><a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-marigold"><Instagram className="size-4" />Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-6 text-center text-xs text-background/40 uppercase tracking-widest">
        © {new Date().getFullYear()} {content.brand.name} · Anantapur
      </div>
    </footer>
  );
}

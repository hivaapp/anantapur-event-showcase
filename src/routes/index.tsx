import { createFileRoute } from "@tanstack/react-router";
import { SiteHome } from "@/components/SiteHome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varna Utsav — Event Decorators in Anantapur" },
      { name: "description", content: "Premier event decoration in Anantapur. Weddings, birthdays, haldi, cradle ceremonies & more. Get a quote on WhatsApp today." },
    ],
  }),
  component: SiteHome,
});

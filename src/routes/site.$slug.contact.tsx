import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages/ContactPage";

export const Route = createFileRoute("/site/$slug/contact")({
  head: () => ({ meta: [{ title: "Contact" }] }),
  component: ContactPage,
});

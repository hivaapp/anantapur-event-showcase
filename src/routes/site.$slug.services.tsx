import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/components/pages/ServicesPage";

export const Route = createFileRoute("/site/$slug/services")({
  head: () => ({ meta: [{ title: "Services" }] }),
  component: ServicesPage,
});

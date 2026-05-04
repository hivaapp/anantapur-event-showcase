import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages/AboutPage";

export const Route = createFileRoute("/site/$slug/about")({
  head: () => ({ meta: [{ title: "About" }] }),
  component: AboutPage,
});

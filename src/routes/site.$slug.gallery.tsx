import { createFileRoute } from "@tanstack/react-router";
import { GalleryPage } from "@/components/pages/GalleryPage";

export const Route = createFileRoute("/site/$slug/gallery")({
  head: () => ({ meta: [{ title: "Gallery" }] }),
  component: GalleryPage,
});

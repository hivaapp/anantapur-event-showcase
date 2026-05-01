import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ContentProvider } from "@/lib/content";
import { SiteHome } from "@/components/SiteHome";
import { getSite, themeStyleVars, type StoredSite } from "@/lib/sitePresets";

export const Route = createFileRoute("/site/$slug")({
  component: SitePage,
});

function SitePage() {
  const { slug } = Route.useParams();
  const [site, setSite] = useState<StoredSite | null | undefined>(undefined);

  useEffect(() => {
    setSite(getSite(slug));
  }, [slug]);

  const styleVars = useMemo(() => (site ? themeStyleVars(site.type) : {}), [site]);

  if (site === undefined) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-muted-foreground text-sm">
        Loading site…
      </div>
    );
  }

  if (site === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-serif italic text-marigold">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Site not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No site exists at <code className="font-mono">/site/{slug}</code>. It may have been generated in another browser.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/create" className="inline-flex items-center justify-center rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
              Create one
            </Link>
            <Link to="/" className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (site.enabled === false) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-3">🚧</div>
          <h1 className="text-3xl font-serif italic">This site is disabled</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The owner has temporarily taken <code className="font-mono">/site/{slug}</code> offline.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link to="/site/$slug/admin" params={{ slug }} className="inline-flex items-center justify-center rounded-full bg-marigold px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
              Owner sign-in
            </Link>
            <Link to="/" className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold hover:bg-accent transition">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styleVars as React.CSSProperties}>
      <ContentProvider override={site.content} readOnly>
        <SiteHome />
      </ContentProvider>
    </div>
  );
}

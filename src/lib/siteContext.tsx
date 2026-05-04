import { createContext, useContext, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

const SiteSlugCtx = createContext<string | null>(null);

export function SiteSlugProvider({ slug, children }: { slug: string; children: ReactNode }) {
  return <SiteSlugCtx.Provider value={slug}>{children}</SiteSlugCtx.Provider>;
}

export function useSiteSlug(): string | null {
  return useContext(SiteSlugCtx);
}

export type Section = "" | "services" | "gallery" | "about" | "contact";

/**
 * Renders a TanStack Link to either the global route (e.g. /services)
 * or the per-site nested route (e.g. /site/$slug/services), depending on
 * whether we're currently rendering inside a generated site.
 */
export function SectionLink({
  section,
  children,
  className,
  activeClassName,
  exact,
  onClick,
}: {
  section: Section;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const slug = useSiteSlug();
  const activeProps = activeClassName ? { className: activeClassName } : undefined;
  const activeOptions = { exact: exact ?? section === "" };

  if (slug) {
    if (section === "") {
      return (
        <Link
          to="/site/$slug"
          params={{ slug }}
          className={className}
          activeProps={activeProps}
          activeOptions={activeOptions}
          onClick={onClick}
        >
          {children}
        </Link>
      );
    }
    const to =
      section === "services" ? "/site/$slug/services"
      : section === "gallery" ? "/site/$slug/gallery"
      : section === "about" ? "/site/$slug/about"
      : "/site/$slug/contact";
    return (
      <Link
        to={to}
        params={{ slug }}
        className={className}
        activeProps={activeProps}
        activeOptions={activeOptions}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  if (section === "") {
    return (
      <Link to="/" className={className} activeProps={activeProps} activeOptions={activeOptions} onClick={onClick}>
        {children}
      </Link>
    );
  }
  const to =
    section === "services" ? "/services"
    : section === "gallery" ? "/gallery"
    : section === "about" ? "/about"
    : "/contact";
  return (
    <Link to={to} className={className} activeProps={activeProps} activeOptions={activeOptions} onClick={onClick}>
      {children}
    </Link>
  );
}

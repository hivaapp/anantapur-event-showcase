import JSZip from "jszip";
import type { StoredSite } from "./sitePresets";
import { themeStyleVars } from "./sitePresets";
import { ADMIN_HTML } from "./exportAdminTemplate";
// Load the runtime as raw text so we can both execute it (in admin.html)
// and use it at build time inside this exporter.
import runtimeSource from "./exportRuntime.js?raw";

// Evaluate the runtime once in this module's scope so we can call its
// page-generation helpers. It assigns to `globalThis.LovableExport`.
function ensureRuntime(): {
  buildAllFiles: (site: { content: unknown; themeVars: Record<string, string>; passcode?: string; brandSlug?: string }, zip: JSZip) => Promise<unknown>;
} {
  const g = globalThis as unknown as { LovableExport?: { buildAllFiles: (...a: unknown[]) => Promise<unknown> } };
  if (!g.LovableExport) {
    // eslint-disable-next-line no-new-func
    new Function(runtimeSource)();
  }
  return g.LovableExport as { buildAllFiles: (site: { content: unknown; themeVars: Record<string, string>; passcode?: string; brandSlug?: string }, zip: JSZip) => Promise<unknown> };
}

function siteDataPayload(site: StoredSite) {
  return {
    brandSlug: site.slug,
    passcode: site.passcode || "admin1234",
    themeId: site.themeId,
    themeVars: themeStyleVars(site),
    content: site.content,
  };
}

function readme(site: StoredSite) {
  return `# ${site.content.brand.name} — Static Website

Generated on ${new Date().toLocaleString()}.

## Files
- index.html, services.html, gallery.html, about.html, contact.html — your public pages.
- admin.html — passcode-protected editor. Open it in a browser to edit any content and re-download an updated ZIP.
- site-data.json — current content (read by admin.html).
- exportRuntime.js — page generator used by admin.html to rebuild the static files.
- assets/ — images.

## Hosting
Pure static site. Drop the folder onto Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any web server. No build step required.

## Editing after migration
1. Open \`admin.html\` (locally in your browser, OR upload it with the rest of the site and visit \`yourdomain.com/admin.html\`).
2. Enter the passcode (default: \`admin1234\` — change it in Settings).
3. Edit any content, then click **Download updated site**.
4. Replace the files on your hosting with the new ZIP contents.

> Tip: if you don't want \`admin.html\` reachable on your live domain, simply don't upload it — keep it locally and re-export when you need to update.
`;
}

export async function exportSiteAsZip(site: StoredSite): Promise<Blob> {
  const runtime = ensureRuntime();
  const zip = new JSZip();
  const payload = siteDataPayload(site);

  await runtime.buildAllFiles(payload, zip);

  // Editable admin bundle
  const inlineJson = JSON.stringify(payload).replace(/</g, "\\u003c");
  zip.file("admin.html", ADMIN_HTML.replace("__SITE_DATA_JSON__", inlineJson));
  zip.file("exportRuntime.js", runtimeSource);
  zip.file("site-data.json", JSON.stringify(payload, null, 2));
  zip.file("README.md", readme(site));

  return await zip.generateAsync({ type: "blob" });
}

export async function downloadSiteZip(site: StoredSite) {
  const blob = await exportSiteAsZip(site);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${site.slug}-website.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

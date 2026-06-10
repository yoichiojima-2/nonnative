// When the site is hosted under /<repo> on GitHub Pages, asset URLs (images,
// not <Link>s) need that prefix too. next/link adds it automatically; for
// plain <img> we add it ourselves.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBase = (p: string) => `${basePath}${p}`;

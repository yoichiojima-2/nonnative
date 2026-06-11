// Everything site-specific lives here. Point `vaultDir` at any Obsidian
// vault (a flat folder of markdown notes, images under `<vaultDir>/assets`)
// and the rest of the codebase stays untouched.
//
// Each value can be overridden per build with an env var, so an external
// vault repo can publish through this engine without editing it (see
// .github/workflows/publish.yml). NEXT_PUBLIC_ prefixes are required where
// the value is also rendered client-side (Next.js inlines them at build).
const siteConfig = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || "nonnative",
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "an obsidian vault, published",
  // folder of markdown notes; relative to the repo root, or an absolute path
  // when the vault lives outside this repo. `index.md` inside it becomes the
  // home page.
  vaultDir: process.env.VAULT_DIR || "notes",
};

export default siteConfig;

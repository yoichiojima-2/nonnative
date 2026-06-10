// Everything site-specific lives here. Point `vaultDir` at any Obsidian
// vault (a flat folder of markdown notes, images under `<vaultDir>/assets`)
// and the rest of the codebase stays untouched.
const siteConfig = {
  title: "nonnative",
  tagline: "an obsidian vault, published",
  // folder of markdown notes, relative to the repo root. `index.md` inside it
  // becomes the home page.
  vaultDir: "notes",
};

export default siteConfig;

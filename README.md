# nonnative

an [Obsidian](https://obsidian.md) vault published as a static site on GitHub
Pages — markdown in, an Obsidian-style reading experience out.

**live site:** https://yoichiojima-2.github.io/nonnative

## how it works

the vault in [`notes/`](notes) is the single source of truth: a flat folder of
markdown files connected with `[[wikilinks]]` and grouped with `#tags`
(`#domain/*`, `#pattern/*`). open it in Obsidian to write; push to `main` to
publish.

at build time the Next.js app reads the vault and renders it with the features
that matter for reading:

- markdown with `[[wikilinks]]` and aliased `[[target|label]]`,
- links to non-existent notes shown as **unresolved** (as Obsidian does),
- **tag** pages for every `#namespace/tag`,
- **backlinks** on every note,
- an interactive **graph view** (global + per-note local),
- an Obsidian-style **quick-switcher search** (fuzzy, keyboard-driven),
- a mobile bottom-nav layout and light/dark theme that follows the system.

the engine is generic — it isn't tied to this vault. point it at any flat
folder of Obsidian markdown by editing [`site.config.ts`](site.config.ts):

```ts
const siteConfig = {
  title: "nonnative",            // site name shown in the header
  tagline: "…",                  // meta description + footer
  vaultDir: "notes",             // folder of markdown, index.md = home page
};
```

images referenced by notes live in `<vaultDir>/assets/` and are mirrored into
`public/assets/` when a build or the dev server starts.

```
app/          routes: home, /notes/[id], /graph, /tags, /tags/[tag]
components/   Markdown, Graph (canvas), Sidebar, SiteChrome (nav + search)
lib/          notes.ts (vault -> data), markdown.ts (wikilink/tag transform)
notes/        the vault (content)
site.config.ts  the only file to touch to reuse this for another vault
```

## develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## build

```bash
pnpm build      # static export -> ./out
```

when hosting under a subpath (e.g. GitHub Pages project sites), set the prefix:

```bash
NEXT_PUBLIC_BASE_PATH=/nonnative pnpm build
```

## deploy

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) builds and deploys
to GitHub Pages on every push to `main`. enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

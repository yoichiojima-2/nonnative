# nonnative

A static-site engine for [Obsidian](https://obsidian.md) vaults — point it at
any flat folder of markdown and it publishes an Obsidian-style reading
experience on GitHub Pages.

**demo site:** https://yoichiojima-2.github.io/nonnative

## features

- markdown with `[[wikilinks]]` and aliased `[[target|label]]`
- links to non-existent notes shown as **unresolved** (as Obsidian does)
- **tag** pages for every `#namespace/tag`
- **backlinks** on every note
- an interactive **graph view** (global + per-note local)
- an Obsidian-style **quick-switcher search** (fuzzy, keyboard-driven)
- mobile bottom-nav layout; light/dark theme follows the system

## using this engine for your own vault

Create a GitHub Actions workflow in your vault repo that calls the reusable
workflow here. Your vault and this engine are checked out side-by-side at
build time — your repo never needs to fork or copy this code.

```yaml
# .github/workflows/pages.yml  (in your vault repo)
name: Publish to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  publish:
    uses: yoichiojima-2/nonnative/.github/workflows/publish.yml@main
    with:
      vault-dir: vault          # subfolder in your repo containing .md files
      title: "My Notes"         # optional; defaults to site.config.ts value
      tagline: "my thoughts"    # optional
      base-path: /my-repo       # set to /repo-name for project Pages; omit for user Pages
    permissions:
      contents: read
      pages: write
      id-token: write
```

Then enable **Settings → Pages → Source: GitHub Actions** in your vault repo.

### inputs

| input | required | default | description |
|---|---|---|---|
| `vault-dir` | no | `vault` | subfolder inside your repo containing the markdown vault |
| `title` | no | `nonnative` | site title shown in the header |
| `tagline` | no | `an obsidian vault, published` | meta description + footer |
| `base-path` | no | `` | URL subpath for project Pages (e.g. `/my-repo`) |

## vault format

The vault is a flat folder of markdown files:

- one note per file, kebab-case names (`my-note.md`)
- `index.md` becomes the home page
- `[[wikilinks]]` and `[[target|label]]` aliases work out of the box
- `#namespace/tag` tags — a tag page is generated for each
- optional YAML frontmatter: `domain: mycolor` colors the node in the graph
- images live in `<vault-dir>/assets/` and are referenced as `![alt](assets/name.png)`

The vault stays fully openable in Obsidian on desktop.

## engine layout

```
app/           routes: home, /notes/[id], /graph, /tags, /tags/[tag]
components/    Markdown, Graph (canvas), Sidebar, SiteChrome (nav + search)
lib/           notes.ts (vault → data), markdown.ts (wikilink/tag transform)
vault/         demo vault (a few notes exercising all features)
site.config.ts the only file to touch when running the engine standalone
```

The engine is vault-agnostic. Everything site-specific is in `site.config.ts`
and overridable via env vars — the reusable workflow sets them for you.

## develop locally

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

To develop against an external vault:

```bash
VAULT_DIR=/path/to/your/vault NEXT_PUBLIC_SITE_TITLE="My Notes" pnpm dev
```

## build

```bash
pnpm build      # static export → ./out
```

## deploy this repo's demo site

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) calls the local
reusable workflow and deploys the demo vault (`vault/`) to
https://yoichiojima-2.github.io/nonnative on every push to `main`.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# this repo

an Obsidian vault (`notes/`) published as a static site (Next.js, `output: "export"`, GitHub Pages). see `README.md`.

- **content** lives in `notes/`: one markdown file per note, kebab-case names, `[[wikilinks]]`, `#namespace/tag` tags, optional yaml frontmatter (`domain:` colors the graph). images go in `notes/assets/` and are referenced as `![alt](assets/<name>.svg)`.
- **the engine** (`app/`, `components/`, `lib/`) is generic — keep it vault-agnostic. anything site- or vault-specific belongs in `site.config.ts`.
- everything renders at build time from the filesystem; there is no server and no client-side data fetching.

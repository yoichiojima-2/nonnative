<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# this repo

a generic Next.js static-export engine (`output: "export"`, GitHub Pages) for publishing Obsidian-compatible markdown vaults. see `README.md`.

**vault-agnostic engine** — the real vault lives in `yoichiojima-2/knowledge`. The `notes/` folder here is a minimal demo vault used to develop and test the engine itself.

- **the engine** (`app/`, `components/`, `lib/`) is generic — keep it vault-agnostic. anything site- or vault-specific belongs in `site.config.ts`.
- **demo vault** (`notes/`): a small set of notes exercising wikilinks, aliases, unresolved links, tags, `domain:` frontmatter, and images. edit freely for engine testing.
- **vault format**: one markdown file per note, kebab-case names, `[[wikilinks]]`, `#namespace/tag` tags, optional yaml frontmatter (`domain:` colors the graph). images go in `notes/assets/` and are referenced as `![alt](assets/<name>.svg)`.
- everything renders at build time from the filesystem; there is no server and no client-side data fetching.

# plan: a personal, web-native "better Obsidian"

Working doc for an in-progress effort. Context: this started as a discussion
("how do I build a better Obsidian?") and converged on a concrete direction.
This file is the handoff — read it together with `README.md` and `AGENTS.md`.

## the vision

A personal (single-user) Obsidian alternative where **the published site is
the app**. No native app, no sync service, no server:

- markdown vault in a git repo is the single source of truth (still openable
  in Obsidian on desktop — full compatibility is a hard requirement),
- the static site (this engine) is the reading experience on every device,
- the iPhone experience is a PWA: add to home screen, offline reading,
- editing from any browser via the GitHub contents API (a fine-grained PAT
  pasted once, stored in localStorage — fine because it's single-user),
- "quick capture" on the phone commits a new note straight to the vault repo.

Explicitly **not** goals: collaboration/multi-user, replacing Obsidian's
desktop editor, plugin ecosystem parity, any backend.

User's stated pain points (priority order):
1. opening/editing the vault on iPhone requires a special git app today,
2. the current site design is "a bit boring".

## decided architecture

Two repos:

- **`nonnative` (this repo) = the engine.** Generic Next.js static-export app
  (`output: "export"`, GitHub Pages). Stays vault-agnostic.
- **a new private "knowledge" repo = the vault.** Will hold `notes/`
  (currently still in this repo). The owner will create it and grant access
  in a later session. Until then, `notes/` here keeps deploying as-is so
  nothing breaks mid-migration.

Wiring: the vault repo's GitHub Action calls a **reusable workflow**
(`workflow_call`) defined in this repo, which checks out engine + vault,
builds, and deploys to the *vault repo's* GitHub Pages.

Per-build configuration is injected via env vars (defaults in
`site.config.ts`):

| env var | meaning |
|---|---|
| `VAULT_DIR` | path to the vault folder, absolute or repo-relative |
| `NEXT_PUBLIC_SITE_TITLE` | site name (NEXT_PUBLIC_ because it renders client-side; inlined at build) |
| `NEXT_PUBLIC_SITE_TAGLINE` | meta description + footer |
| `NEXT_PUBLIC_BASE_PATH` | already existed; subpath for project Pages |

## status

### done (this branch)

- `site.config.ts`: title/tagline/vaultDir overridable via the env vars above.
- `lib/notes.ts` + `next.config.ts`: vault path goes through `path.resolve`
  so `VAULT_DIR` may be absolute (vault outside the repo); asset mirroring
  tolerates a vault without an `assets/` folder.
- Verified: `VAULT_DIR=<abs path> NEXT_PUBLIC_SITE_TITLE=x pnpm build`
  produces correct HTML and mirrored assets.

### next steps, in order

1. **Reusable workflow** `.github/workflows/publish.yml` in this repo:
   - `on: workflow_call` with inputs `vault-dir` (default `notes`), `title`,
     `tagline`, `base-path` (all optional; empty string falls back to
     `site.config.ts` defaults).
   - Steps: checkout caller repo (the vault) into `vault/`; checkout the
     engine into `engine/` — use `repository: yoichiojima-2/nonnative` with
     `ref: ${{ github.job_workflow_sha }}` so the engine version is pinned to
     the ref the caller selected (NB: `github.workflow_ref` won't work here —
     inside a reusable workflow the `github` context belongs to the caller);
     pnpm install + `pnpm build` in `engine/` with the env vars set
     (`VAULT_DIR: ${{ github.workspace }}/vault/<vault-dir input>`);
     `upload-pages-artifact` from `engine/out` + `deploy-pages`.
   - Put `concurrency` in the caller, not here (workflow-level concurrency in
     reusable workflows is unreliable); document that in the example.
2. **Dogfood it**: rewrite this repo's `.github/workflows/pages.yml` as a
   thin caller of the local reusable workflow
   (`uses: ./.github/workflows/publish.yml` with `base-path: /nonnative`).
3. **README rewrite**: reframe the repo as an engine; document the vault-repo
   caller workflow with a copy-paste example.
4. **Migration (blocked on the knowledge repo existing — ask the owner):**
   move `notes/` content + `assets/` to the knowledge repo, add the caller
   workflow there, enable Pages there, then strip `notes/` here down to a
   small demo vault (a few notes exercising wikilinks, aliases, unresolved
   links, tags, `domain:` frontmatter, an image) and update `AGENTS.md`,
   which currently says content lives in `notes/`.
5. **PWA + mobile** (biggest user pain): web manifest + icons + service
   worker for offline reading; verify install-to-home-screen on iOS Safari.
6. **Edit mode + quick capture**: client-side only (static export stays):
   fine-grained PAT (contents read/write on the vault repo only) pasted once
   into a settings screen, stored in localStorage; CodeMirror 6 editor with
   wikilink autocomplete; commits via GitHub contents API; a "+" quick-capture
   button creating `notes/<kebab-name>.md`. Render fresh edits optimistically
   — Pages rebuilds take 1–2 min. Drafts to IndexedDB for offline.
7. **Design refresh**: build the same note page in 2–3 visual directions as
   throwaway branches for the owner to compare on a phone (candidates
   discussed: quiet/typographic; editorial with bold use of the existing
   `domain:` colors; graph-centric/spatial). Commit to one, then apply.

Steps 5–7 land in this repo (the engine) and benefit every vault.

## constraints to respect

- Engine stays generic — nothing vault-specific outside `site.config.ts`.
- Static export, no server, no client-side data fetching for *reading*
  (editing necessarily calls the GitHub API from the client — that's the one
  agreed exception).
- Obsidian compatibility of the vault format is non-negotiable.
- Per `AGENTS.md`: read the bundled Next.js docs in
  `node_modules/next/dist/docs/` before Next.js work.

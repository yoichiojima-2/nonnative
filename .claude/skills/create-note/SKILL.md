---
name: create-note
description: Create a new markdown note in the notes/ vault following this repo's conventions — frontmatter, one-line summary, "where this falls short" section, related wikilinks, tag line, and index.md entry. Use when asked to write, add, or draft a note/article/concept page for the vault.
---

# Creating a note in the vault

Every note in `notes/` follows the same shape. Read 1–2 existing notes first
(e.g. `notes/kant.md`, `notes/caching.md`) to absorb the voice, then write the
new note to match.

## File

- Path: `notes/<kebab-case-name>.md` — flat folder, no subdirectories.
- The filename (without `.md`) is the note's id; `[[wikilinks]]` target it.

## Required structure (in order)

```markdown
---
domain: <domain>
---

# <title, lowercase>

> **in one line:** <a single sentence that captures the whole idea.>

## <body sections...>

## where this falls short

- **<limitation in bold.>** <explanation.>
- ...

## related

- [[other-note]] — <how it connects, one clause>
- [[another-note]] — ...

#domain/<domain> #pattern/<pattern> ...
```

Details:

1. **Frontmatter `domain:`** colors the node in the graph view. Reuse an
   existing domain when possible — check with
   `grep -h 'domain:' notes/*.md | sort -u`. Current set: computer-science,
   economics, engineering, literature, philosophy, religion, science.
2. **Prose style:** lowercase throughout, including headings and the title
   (proper nouns that demand it, like *Critique of Pure Reason*, keep their
   casing in italics). Bold the key terms when first introduced. Explanatory,
   essayistic tone — complete sentences, no bullet-fragment writing in the
   main body.
3. **"where this falls short"** is the signature section: honest, substantive
   criticisms of the concept, each bullet starting with a bolded claim.
4. **`## related`** lists wikilinks to other notes, each with an em-dash
   explanation of the connection. Cross-domain links are encouraged — they
   are what makes the graph interesting (e.g. caching ↔ buddhism).
   Links to notes that don't exist yet are allowed (they render as
   "unresolved", like in Obsidian), but prefer linking real notes; verify
   targets with `ls notes/`.
5. **Tag line:** the last line of the file is a space-separated list of
   `#namespace/tag` tags — always `#domain/<domain>` (matching the
   frontmatter) plus relevant `#pattern/*` tags. Reuse existing tags where
   they fit: `grep -rhoE '#[a-z]+/[a-z0-9-]+' notes/*.md | sort -u`.

## Backlink the new note

- **Update `notes/index.md`:** add the note under its domain heading as
  `- [[note-id]] — <one-clause description>`, matching the existing entries.
- Where it genuinely fits, add the new note to the `## related` section of
  1–3 existing notes so the link goes both ways.

## Optional diagram

If a diagram earns its place:

- Write the Mermaid source as `notes/assets/<note-id>-<what>.mmd`.
- Render it to SVG next to the source: `<note-id>-<what>.svg`
  (`npx -y @mermaid-js/mermaid-cli -i in.mmd -o out.svg` if available).
- Embed in the note as `![<alt>](assets/<note-id>-<what>.svg)`.

## Verify

- Every `[[wikilink]]` either matches a file in `notes/` or is intentionally
  unresolved.
- The frontmatter domain and the `#domain/*` tag agree.
- The note appears in `notes/index.md`.
- Content-only changes don't require a build, but `pnpm build` is the full
  check if engine files were touched too.

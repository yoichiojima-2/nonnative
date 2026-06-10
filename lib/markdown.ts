// Turn Obsidian-flavoured markdown into plain markdown that react-markdown can
// render: wikilinks and #tags become normal links, image paths become
// absolute. Code spans/blocks are protected so we never rewrite inside them.

const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const TAG = /(?<![\w/&#])#([a-z][a-z0-9]*(?:\/[a-z0-9-]+)*)/g;
const IMAGE = /!\[([^\]]*)\]\(([^)]+)\)/g;
// "@@<index>@@" placeholder — "@" never appears in the vault, so restoring
// code can't collide with real numbers in the prose (e.g. "the number 3").
const SLOT = /@@(\d+)@@/g;

const noteId = (target: string) => target.trim().toLowerCase().replace(/\s+/g, "-");
const tagSlug = (tag: string) => tag.replace(/\//g, "-");

export function toMarkdown(content: string, existingIds: Set<string>): string {
  const stash: string[] = [];
  const keep = (m: string) => `@@${stash.push(m) - 1}@@`;

  // 1. hide code so its contents are left untouched
  let s = content
    .replace(/```[\s\S]*?```/g, keep)
    .replace(/`[^`]+`/g, keep);

  // 2. image paths -> absolute (the <img> renderer adds the basePath)
  s = s.replace(IMAGE, (m, alt, src) =>
    src.startsWith("http") ? m : `![${alt}](/${src.replace(/^\.?\//, "")})`
  );

  // 3. wikilinks -> internal links, or a marker for unresolved ones
  s = s.replace(WIKILINK, (m, target, label) => {
    const id = noteId(target);
    const text = ((label || target) as string).trim();
    // "unresolved" (no #) so the #tag pass below can't mistake it for a tag
    return existingIds.has(id) ? `[${text}](/notes/${id})` : `[${text}](unresolved)`;
  });

  // 4. #tags -> tag pages
  s = s.replace(TAG, (m, tag) => `[#${tag}](/tags/${tagSlug(tag)})`);

  // 5. restore code
  return s.replace(SLOT, (m, i) => stash[+i]);
}

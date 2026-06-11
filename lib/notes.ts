// Reads the Obsidian vault and turns it into the data the site needs: notes,
// wikilinks, backlinks, tags, the graph, and the search index. Everything
// runs at build time (static export), so plain fs is fine.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import siteConfig from "@/site.config";

export interface Note {
  id: string;
  title: string;
  domain: string;
  content: string;
  tags: string[];
  excerpt: string;
  text: string;
  links: string[];
  backlinks: string[];
}

export interface GraphNode {
  id: string;
  title: string;
  url: string;
  domain: string;
  degree: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SearchDoc {
  id: string;
  title: string;
  url: string;
  tags: string[];
  text: string;
  excerpt: string;
}

export interface TagEntry {
  tag: string;
  slug: string;
  namespace: string;
  notes: Note[];
}

const VAULT = path.resolve(process.cwd(), siteConfig.vaultDir);

// ── small helpers ────────────────────────────────────────────────────────
const noteId = (target: string) => target.trim().toLowerCase().replace(/\s+/g, "-");
const tagSlug = (tag: string) => tag.replace(/\//g, "-");

const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const TAG = /(?<![\w/&#])#([a-z][a-z0-9]*(?:\/[a-z0-9-]+)*)/g;

// drop code so links/tags inside code blocks are ignored
const stripCode = (text: string) =>
  text.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]+`/g, " ");

function wikilinkTargets(body: string): string[] {
  const out = [];
  for (const m of stripCode(body).matchAll(WIKILINK)) out.push(noteId(m[1]));
  return out;
}

function tagsIn(body: string): string[] {
  const seen = new Set<string>();
  for (const m of stripCode(body).matchAll(TAG)) seen.add(m[1]);
  return [...seen];
}

// the first "> ..." callout line, as a plain-text excerpt
function excerptOf(body: string): string {
  const line = body.split("\n").find((l) => l.trim().startsWith(">"));
  if (!line) return "";
  return line
    .replace(/^\s*>\s?/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(WIKILINK, (m, t, label) => label || t)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^in one line:\s*/i, "")
    .trim();
}

// readable plain text for the search index
function plainText(body: string): string {
  return stripCode(body)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(WIKILINK, (m, t, label) => label || t)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(TAG, " ")
    .replace(/[#>*_`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── load + enrich every note once ────────────────────────────────────────
let cache: { notes: Record<string, Note>; ids: Set<string> } | null = null;

function build() {
  if (cache) return cache;

  const files = fs.readdirSync(VAULT).filter((f) => f.endsWith(".md"));
  const notes: Record<string, Note> = {};

  for (const file of files) {
    const id = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(VAULT, file), "utf8");
    const { data, content } = matter(raw);
    const title = (content.match(/^#\s+(.+)$/m)?.[1] || id).trim();
    notes[id] = {
      id,
      title,
      domain: data.domain || (id === "index" ? "index" : "other"),
      content,
      tags: tagsIn(content),
      excerpt: excerptOf(content),
      text: plainText(content),
      links: [],
      backlinks: [],
    };
  }

  const ids = new Set(Object.keys(notes));

  // resolve outgoing links (only to notes that exist), then invert for backlinks
  for (const note of Object.values(notes)) {
    note.links = [...new Set(wikilinkTargets(note.content))].filter(
      (t) => ids.has(t) && t !== note.id
    );
  }
  for (const note of Object.values(notes)) {
    for (const target of note.links) notes[target].backlinks.push(note.id);
  }

  cache = { notes, ids };
  return cache;
}

const byTitle = (a: Note, b: Note) => a.title.localeCompare(b.title);

// ── public API used by the pages ─────────────────────────────────────────
export function getExistingIds(): Set<string> {
  return build().ids;
}

export function getAllNotes(): Note[] {
  return Object.values(build().notes).sort(byTitle);
}

export function getNote(id: string): Note | null {
  return build().notes[id] || null;
}

// the graph: a node per note, an edge per wikilink. the index MOC is left out
// so its many links don't drown everything else.
export function getGraph(): GraphData {
  const { notes } = build();
  const real = Object.values(notes).filter((n) => n.id !== "index");
  const degree = Object.fromEntries(real.map((n) => [n.id, 0]));
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const note of real) {
    for (const target of note.links) {
      if (target === "index") continue;
      const key = [note.id, target].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: note.id, target });
      degree[note.id]++;
      degree[target]++;
    }
  }

  const nodes = real.map((n) => ({
    id: n.id,
    title: n.title,
    url: `/notes/${n.id}`,
    domain: n.domain,
    degree: degree[n.id],
  }));
  return { nodes, edges };
}

export function getSearchDocs(): SearchDoc[] {
  return getAllNotes()
    .filter((n) => n.id !== "index")
    .map((n) => ({
      id: n.id,
      title: n.title,
      url: `/notes/${n.id}`,
      tags: n.tags,
      text: n.text.slice(0, 1200),
      excerpt: (n.excerpt || n.text).slice(0, 120),
    }));
}

// ── tags ──────────────────────────────────────────────────────────────────
function allTags(): Record<string, Note[]> {
  const map: Record<string, Note[]> = {};
  for (const note of getAllNotes()) {
    for (const tag of note.tags) (map[tag] ||= []).push(note);
  }
  return map;
}

export function getTags(): TagEntry[] {
  const map = allTags();
  return Object.keys(map)
    .sort()
    .map((tag) => ({
      tag,
      slug: tagSlug(tag),
      namespace: tag.split("/")[0],
      notes: map[tag].sort(byTitle),
    }));
}

export function getTag(slug: string): TagEntry | null {
  return getTags().find((t) => t.slug === slug) || null;
}

"use client";
// Header, mobile bottom-nav, theme toggle, and an Obsidian-style quick-switcher
// search modal (fuzzy match, highlighted hits, keyboard-driven). All the
// interactive chrome lives here so the pages can stay plain server components.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import siteConfig from "@/site.config";
import type { SearchDoc } from "@/lib/notes";

// ── tiny inline icons ──
const PATHS: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5 M5 9.5V21h14V9.5",
  graph: "M7.7 7.4 10.6 16 M16.6 8.6 13 16.6",
  tags: "M3 12.5 11 4.5h6.5V11L9.5 19z",
  search: "M15 15l5 5",
};
function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="icon">
      {name === "graph" && (
        <>
          <circle cx="6" cy="6" r="2.3" /><circle cx="18" cy="7" r="2.3" />
          <circle cx="12" cy="18" r="2.3" />
        </>
      )}
      {name === "tags" && <circle cx="15" cy="9" r="1.1" />}
      {name === "search" && <circle cx="10.5" cy="10.5" r="6" />}
      {name === "theme" ? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" stroke="none" />
        </>
      ) : (
        <path d={PATHS[name]} />
      )}
    </svg>
  );
}

// ── fuzzy matcher: subsequence with bonuses for contiguous + word-start hits ──
function fuzzy(query: string, text: string) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let prev = -2;
  const positions: number[] = [];
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      positions.push(i);
      score += i === prev + 1 ? 6 : 1;
      if (i === 0 || /[\s\-/_]/.test(t[i - 1])) score += 4;
      prev = i;
      qi += 1;
    }
  }
  return qi === q.length ? { score, positions } : null;
}

function ThemeButton() {
  return (
    <button
      className="theme-toggle"
      aria-label="toggle theme"
      title="toggle theme"
      onClick={() => {
        const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      }}
    >
      <Icon name="theme" />
    </button>
  );
}

function Highlight({ text, positions }: { text: string; positions: number[] }) {
  const set = new Set(positions);
  return (
    <>
      {[...text].map((ch, i) => (set.has(i) ? <mark key={i}>{ch}</mark> : <span key={i}>{ch}</span>))}
    </>
  );
}

export default function SiteChrome({ docs }: { docs: SearchDoc[] }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function openSearch() {
    setOpen(true);
    setQuery("");
    setActive(0);
  }

  // rank notes; empty query lists everything (the quick-switcher feel)
  const results = useMemo(() => {
    if (!query.trim()) {
      return docs.map((d) => ({ doc: d, positions: [] as number[], score: 0 })).slice(0, 50);
    }
    const q = query.trim();
    return docs
      .map((d) => {
        const inTitle = fuzzy(q, d.title);
        if (inTitle) return { doc: d, positions: inTitle.positions, score: inTitle.score + 100 };
        const inTags = d.tags.some((tag) => tag.includes(q.toLowerCase()));
        if (inTags) return { doc: d, positions: [] as number[], score: 50 };
        if (d.text.toLowerCase().includes(q.toLowerCase()))
          return { doc: d, positions: [] as number[], score: 20 };
        return null;
      })
      .filter((r) => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [query, docs]);

  // lock background scroll while the modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // global shortcuts: "/" or Cmd/Ctrl-K to open
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = /input|textarea/i.test(document.activeElement?.tagName || "");
      if (!open && (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && !typing) {
        e.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function go(url: string) {
    setOpen(false);
    router.push(url);
  }

  function onModalKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].doc.url);
    }
  }

  return (
    <>
      <header className="topbar">
        <Link className="brand" href="/">{siteConfig.title}</Link>
        <nav className="topnav">
          <Link href="/" className={isActive("/") ? "active" : ""}>home</Link>
          <Link href="/graph" className={isActive("/graph") ? "active" : ""}>graph</Link>
          <Link href="/tags" className={isActive("/tags") ? "active" : ""}>tags</Link>
        </nav>
        <span className="spacer" />
        <button className="search-trigger" onClick={openSearch}>
          <Icon name="search" />
          <span>search…</span>
          <kbd>/</kbd>
        </button>
        <ThemeButton />
      </header>

      <nav className="bottomnav">
        <Link href="/" className={isActive("/") ? "active" : ""}><Icon name="home" /><span>home</span></Link>
        <Link href="/graph" className={isActive("/graph") ? "active" : ""}><Icon name="graph" /><span>graph</span></Link>
        <Link href="/tags" className={isActive("/tags") ? "active" : ""}><Icon name="tags" /><span>tags</span></Link>
        <button onClick={openSearch}><Icon name="search" /><span>search</span></button>
      </nav>

      {open && (
        <div className="palette" onKeyDown={onModalKey}>
          <div className="palette-backdrop" onClick={() => setOpen(false)} />
          <div className="palette-box" role="dialog" aria-modal="true" aria-label="search">
            <div className="palette-field">
              <Icon name="search" />
              <input
                autoFocus
                type="search"
                placeholder="search notes…"
                value={query}
                spellCheck={false}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
              />
              <kbd>esc</kbd>
            </div>
            <ul className="palette-results">
              {results.length === 0 && <li className="palette-empty">no matches</li>}
              {results.map(({ doc, positions }, i) => (
                <li key={doc.id}>
                  <button
                    className={i === active ? "active" : ""}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(doc.url)}
                  >
                    <span className="r-title"><Highlight text={doc.title} positions={positions} /></span>
                    <span className="r-sub">{doc.excerpt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

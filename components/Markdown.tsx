// Renders a note's markdown. Internal links use next/link; unresolved
// wikilinks render as a dimmed span (as Obsidian shows them); images get the
// basePath prefix. This is a server component — it runs at build time.
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { withBase } from "@/lib/base";
import { toMarkdown } from "@/lib/markdown";

export default function Markdown({
  content,
  existingIds,
}: {
  content: string;
  existingIds: Set<string>;
}) {
  const md = toMarkdown(content, existingIds);

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href = "", children }) {
            if (href === "unresolved") {
              return (
                <span className="wikilink unresolved" title="unresolved link">
                  {children}
                </span>
              );
            }
            if (href.startsWith("/")) {
              const className = href.startsWith("/tags/") ? "tag" : "wikilink";
              return (
                <Link className={className} href={href}>
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          img({ src = "", alt }) {
            const s = String(src);
            // absolute URLs (e.g. hotlinked wikimedia images) are already
            // complete — only local asset paths need the basePath prefix.
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.startsWith("http") ? s : withBase(s)} alt={alt ?? ""} loading="lazy" />
            );
          },
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}

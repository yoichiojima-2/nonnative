// One tag: every note that carries it.
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTags, getTag } from "@/lib/notes";

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  return getTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const t = getTag((await params).tag);
  return { title: t ? `#${t.tag}` : "not found" };
}

export default async function TagPage({ params }: Props) {
  const t = getTag((await params).tag);
  if (!t) notFound();

  return (
    <main className="layout wide">
      <div className="content">
        <h1>#{t.tag}</h1>
        <p>
          {t.notes.length} note{t.notes.length === 1 ? "" : "s"} tagged{" "}
          <span className="tag-chip">#{t.tag}</span>
        </p>
        <ul className="note-list">
          {t.notes.map((n) => (
            <li key={n.id}>
              <Link className="wikilink" href={`/notes/${n.id}`}>{n.title}</Link>
              <span className="excerpt">{n.excerpt}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

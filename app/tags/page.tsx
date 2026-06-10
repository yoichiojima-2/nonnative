// All tags, grouped by namespace (e.g. #domain/* and #pattern/*).
import Link from "next/link";
import { getTags } from "@/lib/notes";

export const metadata = { title: "tags" };

export default function TagsPage() {
  const tags = getTags();
  const namespaces = [...new Set(tags.map((t) => t.namespace))].sort();

  return (
    <main className="layout wide">
      <div className="content">
        <h1>tags</h1>
        {namespaces.map((ns) => (
          <div key={ns} className="tag-group">
            <h3>#{ns}</h3>
            <div className="tag-cloud">
              {tags
                .filter((t) => t.namespace === ns)
                .map((t) => (
                  <Link key={t.slug} className="tag" href={`/tags/${t.slug}`}>
                    #{t.tag} <span className="tag-count">{t.notes.length}</span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

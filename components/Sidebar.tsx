// The right-hand panel on a note page: a local graph, outgoing links,
// backlinks, and tags — the Obsidian reading context.
import Link from "next/link";
import Graph from "@/components/Graph";
import { getNote, type GraphData, type Note } from "@/lib/notes";

function NoteList({ ids }: { ids: string[] }) {
  if (ids.length === 0) return <p className="empty">none</p>;
  return (
    <ul>
      {ids
        .map((id) => getNote(id)!)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((n) => (
          <li key={n.id}>
            <Link className="wikilink" href={`/notes/${n.id}`}>{n.title}</Link>
          </li>
        ))}
    </ul>
  );
}

export default function Sidebar({ note, graph }: { note: Note; graph: GraphData }) {
  return (
    <aside className="sidebar">
      <div className="card graph-card">
        <Graph nodes={graph.nodes} edges={graph.edges} focus={note.id} />
      </div>
      <div className="card">
        <h4>links to</h4>
        <NoteList ids={note.links} />
      </div>
      <div className="card">
        <h4>backlinks</h4>
        <NoteList ids={note.backlinks} />
      </div>
      <div className="card">
        <h4>tags</h4>
        {note.tags.length === 0 ? (
          <p className="empty">none</p>
        ) : (
          note.tags.map((tag) => (
            <Link key={tag} className="tag" href={`/tags/${tag.replace(/\//g, "-")}`}>#{tag}</Link>
          ))
        )}
      </div>
    </aside>
  );
}

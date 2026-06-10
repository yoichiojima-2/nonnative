// Home: the vault's index note, with the full graph as a hero on top.
import Markdown from "@/components/Markdown";
import Graph from "@/components/Graph";
import { getNote, getExistingIds, getGraph } from "@/lib/notes";

export default function Home() {
  const index = getNote("index");
  const existingIds = getExistingIds();
  const graph = getGraph();

  return (
    <main className="layout wide">
      <div className="content">
        <div className="graph-hero">
          <Graph nodes={graph.nodes} edges={graph.edges} />
          <span className="graph-hint">drag · scroll to zoom · click a node</span>
        </div>
        {index && <Markdown content={index.content} existingIds={existingIds} />}
      </div>
    </main>
  );
}

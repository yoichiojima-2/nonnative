// The whole vault as one interactive graph.
import Graph from "@/components/Graph";
import { getGraph } from "@/lib/notes";

export const metadata = { title: "graph" };

export default function GraphPage() {
  const graph = getGraph();
  return (
    <main className="layout wide">
      <div className="content">
        <h1>graph</h1>
        <p>
          every note is a node; every <strong>[[wikilink]]</strong> is an edge. drag to
          rearrange, scroll to zoom, click a node to open it.
        </p>
        <div className="graph-full">
          <Graph nodes={graph.nodes} edges={graph.edges} />
          <span className="graph-hint">drag · scroll to zoom · click a node</span>
        </div>
      </div>
    </main>
  );
}

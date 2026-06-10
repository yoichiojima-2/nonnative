// A single note: rendered markdown plus the Obsidian reading sidebar.
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import Sidebar from "@/components/Sidebar";
import { getAllNotes, getNote, getExistingIds, getGraph } from "@/lib/notes";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getAllNotes()
    .filter((n) => n.id !== "index")
    .map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Props) {
  const note = getNote((await params).id);
  return { title: note ? note.title : "not found" };
}

export default async function NotePage({ params }: Props) {
  const note = getNote((await params).id);
  if (!note) notFound();

  return (
    <main className="layout">
      <div className="content">
        <Markdown content={note.content} existingIds={getExistingIds()} />
      </div>
      <Sidebar note={note} graph={getGraph()} />
    </main>
  );
}

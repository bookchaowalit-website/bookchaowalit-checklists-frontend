import Link from "next/link";
import { getAllChecklists } from "@/lib/mdx";
import { ChecklistCard } from "@/components/checklist-ui";

export default async function ChecklistsPage() {
  const checklists = await getAllChecklists();

  return (
    <main className="flight-desk">
      <div className="desk-shell">
        <header className="flight-topbar"><Link href="/" className="flight-mark">PREFLIGHT / DESK</Link><span>route book · {checklists.length} procedures</span></header>
        <section className="archive-heading"><p className="flight-kicker">index / all procedures</p><h1>The route book.</h1><p>Every checklist on the shelf, arranged by priority so the next safe move is easy to find.</p></section>
        <section className="checklist-grid archive-grid" aria-label="All checklists">{checklists.map((checklist, index) => <ChecklistCard checklist={checklist} index={index} key={checklist.slug} />)}</section>
        <footer className="flight-footer"><Link href="/">← Return to dispatch</Link> · progress stays in this browser.</footer>
      </div>
    </main>
  );
}

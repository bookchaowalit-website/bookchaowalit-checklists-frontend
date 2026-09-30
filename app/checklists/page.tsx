import Link from "next/link";
import { getAllChecklists } from "@/lib/mdx";
import { ChecklistIndex } from "@/components/checklist-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Route book — all checklists",
  description: "Search every checklist on the shelf and open one to run it.",
  alternates: { canonical: "/checklists" },
};

export default async function ChecklistsPage() {
  const checklists = await getAllChecklists();

  return (
    <main className="flight-desk">
      <div className="desk-shell">
        <header className="flight-topbar"><Link href="/" className="flight-mark">PREFLIGHT / DESK</Link><span>route book · {checklists.length} procedures</span></header>
        <section className="archive-heading"><p className="flight-kicker">index / all procedures</p><h1>The route book.</h1><p>Every checklist on the shelf, arranged by priority so the next safe move is easy to find.</p></section>
        <ChecklistIndex checklists={checklists} />
        <footer className="flight-footer"><Link href="/">← Return to dispatch</Link> · progress stays in this browser.</footer>
      </div>
    </main>
  );
}

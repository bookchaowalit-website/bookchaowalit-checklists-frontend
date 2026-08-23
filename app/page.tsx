import Link from "next/link";
import { getAllChecklists } from "@/lib/mdx";
import { ChecklistCard } from "@/components/checklist-ui";

export default async function Home() {
  const checklists = await getAllChecklists();
  const featured = checklists[0];
  return (
    <main className="flight-desk">
      <div className="desk-shell">
        <span className="product-contract" aria-hidden="true">procedure shelf / run a route</span>
        <header className="flight-topbar"><Link href="/" className="flight-mark">PREFLIGHT / DESK</Link><span>route book · {checklists.length} procedures</span></header>
        <section className="flight-hero"><div><p className="flight-kicker">before the work leaves the ground</p><h1>Know the next move.</h1></div><p className="flight-deck">A practical shelf of checklists for launches, interviews, and content work. Open one, run it, and leave the guesswork on the ground.</p></section>
        <section className="dispatch-panel" aria-labelledby="dispatch-heading"><div className="dispatch-copy"><span className="panel-code">01 / DISPATCH</span><h2 id="dispatch-heading">Today&apos;s route</h2><p>Pick a procedure and make the sequence visible before the work gets noisy.</p><Link href={featured ? `/checklists/${featured.slug}` : "/checklists"} className="dispatch-link">{featured ? `Open ${featured.title}` : "View the route book"} <span aria-hidden="true">↗</span></Link></div><div className="dispatch-readout"><strong>{checklists.length}</strong><span>procedures<br />on the shelf</span></div></section>
        <section className="shelf" aria-labelledby="shelf-heading"><header className="shelf-heading"><div><span className="panel-code">02 / ROUTE BOOK</span><h2 id="shelf-heading">The current procedures</h2></div><Link href="/checklists">Open full index →</Link></header><div className="checklist-grid">{checklists.slice(0, 6).map((checklist, index) => <ChecklistCard checklist={checklist} index={index} key={checklist.slug} />)}</div></section>
        <footer className="flight-footer">A personal procedure shelf · content is read from local MDX and progress stays in this browser.</footer>
      </div>
    </main>
  );
}

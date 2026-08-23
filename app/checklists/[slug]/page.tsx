import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllChecklists, getChecklistBySlug } from "@/lib/mdx";
import { ChecklistRunner } from "@/components/checklist-ui";

export async function generateStaticParams() { const checklists = await getAllChecklists(); return checklists.map((checklist) => ({ slug: checklist.slug })); }

export default async function ChecklistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const checklist = await getChecklistBySlug(slug);
  if (!checklist) notFound();
  const count = checklist.items.reduce((total, section) => total + Math.max(section.length - 1, 0), 0);
  return <main className="flight-desk"><div className="desk-shell"><header className="flight-topbar"><Link href="/" className="flight-mark">PREFLIGHT / DESK</Link><Link href="/checklists" className="flight-back">Back to route book</Link></header><article className="procedure-sheet"><header className="procedure-header"><div><p className="flight-kicker">procedure / {checklist.category}</p><h1>{checklist.title}</h1><p>{checklist.description}</p></div><div className={`priority-stamp priority-${checklist.priority}`}>{checklist.priority}<span>priority</span></div></header><div className="procedure-facts"><span><b>Checks</b>{count}</span><span><b>Phases</b>{checklist.items.length}</span><span><b>Record</b>{checklist.slug}</span></div><ChecklistRunner checklist={checklist} /></article><footer className="flight-footer">The checklist is a personal operating aid. It does not certify safety, readiness, or completion outside this browser.</footer></div></main>;
}

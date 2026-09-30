"use client";

import Link from "next/link";
import { countChecks, restoreProgress, searchChecklists } from "@/lib/checklist";
import type { Checklist } from "@/lib/checklist";
import { useEffect, useMemo, useState } from "react";

export function ChecklistCard({ checklist, index }: { checklist: Checklist; index: number }) {
  const count = countChecks(checklist);

  return (
    <Link href={`/checklists/${checklist.slug}`} className={`checklist-card priority-${checklist.priority}`}>
      <div className="card-top"><span>0{index + 1}</span><b>{checklist.priority}</b></div>
      <h3>{checklist.title}</h3>
      <p>{checklist.description}</p>
      <div className="card-bottom"><span>{checklist.category}</span><span>{count} checks <span aria-hidden="true">↗</span></span></div>
    </Link>
  );
}

export function ChecklistRunner({ checklist }: { checklist: Checklist }) {
  const sections = useMemo(() => checklist.items.map((section) => section.slice(1)), [checklist.items]);
  const [checked, setChecked] = useState<boolean[][]>(() => sections.map((section) => section.map(() => false)));
  const [ready, setReady] = useState(false);
  const storageKey = `checklist-progress-v2-${checklist.slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        // Hydrate a saved run after the server-rendered empty checklist.
        const restored = restoreProgress(JSON.parse(saved) as unknown, sections.map((section) => section.length));
        if (restored) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setChecked(restored);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch { /* A fresh run is a valid fallback. */ }
    setReady(true);
  }, [sections, storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch { /* Storage can be full or blocked; the run still works in memory. */ }
  }, [checked, ready, storageKey]);

  const total = sections.reduce((sum, section) => sum + section.length, 0);
  const complete = checked.reduce((sum, section) => sum + section.filter(Boolean).length, 0);
  const progress = total ? Math.round((complete / total) * 100) : 0;
  const reset = () => setChecked(sections.map((section) => section.map(() => false)));

  return (
    <div className="run-sheet">
      <div className="run-readout">
        <div><span className="panel-code">LIVE RUN / {checklist.priority.toUpperCase()}</span><strong>{progress}%</strong><span aria-live="polite">{complete} of {total} checks clear</span></div>
        <button type="button" onClick={reset}>Reset run</button>
      </div>
      <div className="progress-line" role="progressbar" aria-label={`${progress}% complete`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
      <div className="run-sections">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="run-section" aria-labelledby={`phase-${sectionIndex}`}>
            <header><span>PHASE 0{sectionIndex + 1}</span><h2 id={`phase-${sectionIndex}`}>{checklist.items[sectionIndex]?.[0] || `Phase ${sectionIndex + 1}`}</h2></header>
            <ul>{section.map((item, itemIndex) => <li key={`${itemIndex}-${item}`}><label><input type="checkbox" checked={checked[sectionIndex]?.[itemIndex] ?? false} onChange={() => setChecked((current) => current.map((row, rowIndex) => rowIndex === sectionIndex ? row.map((value, valueIndex) => valueIndex === itemIndex ? !value : value) : row))} /><span>{item}</span></label></li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ChecklistIndex({ checklists }: { checklists: Checklist[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchChecklists(checklists, query), [checklists, query]);

  return (
    <>
      <div className="index-search">
        <label htmlFor="checklist-search">Search procedures</label>
        <input id="checklist-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, category, or a single check…" autoComplete="off" />
        <span aria-live="polite">{results.length} of {checklists.length} shown</span>
      </div>
      {results.length === 0 ? (
        <p className="index-empty">No procedure matches “{query}”.</p>
      ) : (
        <section className="checklist-grid archive-grid" aria-label="Matching checklists">
          {results.map((checklist, index) => <ChecklistCard checklist={checklist} index={index} key={checklist.slug} />)}
        </section>
      )}
    </>
  );
}

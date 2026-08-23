"use client";

import Link from "next/link";
import type { ChecklistItem } from "@/lib/mdx";
import { useEffect, useMemo, useState } from "react";

export function ChecklistCard({ checklist, index }: { checklist: ChecklistItem; index: number }) {
  const count = checklist.items.reduce((total, section) => total + Math.max(section.length - 1, 0), 0);

  return (
    <Link href={`/checklists/${checklist.slug}`} className={`checklist-card priority-${checklist.priority}`}>
      <div className="card-top"><span>0{index + 1}</span><b>{checklist.priority}</b></div>
      <h3>{checklist.title}</h3>
      <p>{checklist.description}</p>
      <div className="card-bottom"><span>{checklist.category}</span><span>{count} checks ↗</span></div>
    </Link>
  );
}

export function ChecklistRunner({ checklist }: { checklist: ChecklistItem }) {
  const sections = useMemo(() => checklist.items.map((section) => section.slice(1)), [checklist.items]);
  const [checked, setChecked] = useState<boolean[][]>(() => sections.map((section) => section.map(() => false)));
  const [ready, setReady] = useState(false);
  const storageKey = `checklist-progress-v2-${checklist.slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        // Hydrate a saved run after the server-rendered empty checklist.
        const parsed = JSON.parse(saved) as unknown;
        const isValid = Array.isArray(parsed)
          && parsed.length === sections.length
          && parsed.every((row, index) => Array.isArray(row) && row.length === sections[index].length && row.every((value) => typeof value === "boolean"));
        if (isValid) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setChecked(parsed as boolean[][]);
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch { /* A fresh run is a valid fallback. */ }
    setReady(true);
  }, [sections, storageKey]);

  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, ready, storageKey]);

  const total = sections.reduce((sum, section) => sum + section.length, 0);
  const complete = checked.reduce((sum, section) => sum + section.filter(Boolean).length, 0);
  const progress = total ? Math.round((complete / total) * 100) : 0;
  const reset = () => setChecked(sections.map((section) => section.map(() => false)));

  return (
    <div className="run-sheet">
      <div className="run-readout">
        <div><span className="panel-code">LIVE RUN / {checklist.priority.toUpperCase()}</span><strong>{progress}%</strong><span>{complete} of {total} checks clear</span></div>
        <button type="button" onClick={reset}>Reset run</button>
      </div>
      <div className="progress-line" role="progressbar" aria-label={`${progress}% complete`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
      <div className="run-sections">
        {sections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="run-section">
            <header><span>PHASE 0{sectionIndex + 1}</span><h2>{checklist.items[sectionIndex]?.[0]}</h2></header>
            <ul>{section.map((item, itemIndex) => <li key={item}><label><input type="checkbox" checked={checked[sectionIndex]?.[itemIndex] ?? false} onChange={() => setChecked((current) => current.map((row, rowIndex) => rowIndex === sectionIndex ? row.map((value, valueIndex) => valueIndex === itemIndex ? !value : value) : row))} /><span>{item}</span></label></li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}

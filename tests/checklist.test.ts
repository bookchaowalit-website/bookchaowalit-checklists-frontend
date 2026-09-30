import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildChecklist,
  countChecks,
  isValidSlug,
  normalizeItems,
  normalizePriority,
  parseMarkdownItems,
  restoreProgress,
  searchChecklists,
  sortByPriority,
} from "../lib/checklist.ts";

describe("checklist parsing", () => {
  it("splits YAML-folded sections into [title, ...items]", () => {
    assert.deepEqual(normalizeItems(["Plan - Define goals - Pick owner", "Ship - Deploy"], ""), [
      ["Plan", "Define goals", "Pick owner"],
      ["Ship", "Deploy"],
    ]);
  });

  it("falls back to markdown headings and bullets in the body", () => {
    const body = "Intro\n### Prep\n- one\n- two\n### Go\n* three\n### Empty\n";
    assert.deepEqual(parseMarkdownItems(body), [["Prep", "one", "two"], ["Go", "three"]]);
    assert.deepEqual(normalizeItems(undefined, "- a\n- b"), [["", "a", "b"]]);
  });

  it("builds a checklist with safe defaults", () => {
    const checklist = buildChecklist("launch", { priority: "urgent", items: ["A - x"] }, "");
    assert.equal(checklist.title, "launch");
    assert.equal(checklist.category, "general");
    assert.equal(checklist.priority, "medium");
    assert.equal(countChecks(checklist), 1);
    assert.equal(normalizePriority("high"), "high");
  });
});

describe("checklist helpers", () => {
  const a = buildChecklist("a", { title: "Alpha", priority: "low", category: "career", items: ["S - resume"] }, "");
  const b = buildChecklist("b", { title: "Beta", priority: "high", category: "launch", items: ["S - deploy"] }, "");

  it("orders by priority then title", () => {
    assert.deepEqual(sortByPriority([a, b]).map((c) => c.slug), ["b", "a"]);
  });

  it("searches titles, categories, and items", () => {
    assert.deepEqual(searchChecklists([a, b], "RESUME").map((c) => c.slug), ["a"]);
    assert.deepEqual(searchChecklists([a, b], "launch").map((c) => c.slug), ["b"]);
    assert.equal(searchChecklists([a, b], "  ").length, 2);
  });

  it("only accepts simple kebab-case slugs", () => {
    assert.equal(isValidSlug("job-interview"), true);
    assert.equal(isValidSlug("../etc/passwd"), false);
    assert.equal(isValidSlug(".."), false);
    assert.equal(isValidSlug("Bad Slug"), false);
  });

  it("restores saved progress only when the shape matches", () => {
    assert.deepEqual(restoreProgress([[true, false], [true]], [2, 1]), [[true, false], [true]]);
    assert.equal(restoreProgress([[true]], [2, 1]), null);
    assert.equal(restoreProgress([[true, "x"], [true]], [2, 1]), null);
    assert.equal(restoreProgress("nope", [1]), null);
  });
});

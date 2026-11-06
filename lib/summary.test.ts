// Run: node --test lib/summary.test.ts   (Node built-in runner, no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildSummary, summaryStats, MAX_ROWS } from "./summary.ts";

const mk = (i: number, extra: object = {}) => ({
  id: i, day: `2026-11-${String(i).padStart(2, "0")}`, bleeding: 2, pain: 3, mood: 4, healing: 5,
  pad_soak: 0, note: null, created_at: "x", ...extra,
});
const profile = { delivery_date: "2026-10-30", appointment_date: "2026-12-10" };

test("rows are mapped from check-ins", () => {
  const r = buildSummary([mk(2, { pad_soak: 1, note: " dolor " })], profile);
  assert.deepEqual(r.rows[0], { day: "2026-11-02", bleeding: 2, pain: 3, mood: 4, healing: 5, padSoak: true, note: "dolor" });
});
test("empty: no rows and no stats", () => {
  const r = buildSummary([], profile);
  assert.deepEqual(r, { rows: [] });
  assert.equal(summaryStats(r.rows), null);
});
test("14 check-ins kept; 20 capped to the latest 14, sorted by day", () => {
  const many = Array.from({ length: 20 }, (_, i) => mk(20 - i));
  const r = buildSummary(many, profile);
  assert.equal(r.rows.length, MAX_ROWS);
  assert.equal(r.rows[0].day, "2026-11-07");
  assert.equal(r.rows.at(-1)!.day, "2026-11-20");
});
test("stats: span, last, average, range, pad days and note days, from her numbers only", () => {
  const rows = buildSummary([mk(1, { mood: 1 }), mk(2, { mood: 2, pad_soak: 1, note: "a" }), mk(3, { mood: 5, note: "b" })], profile).rows;
  const s = summaryStats(rows)!;
  assert.equal(s.n, 3);
  assert.equal(s.from, "2026-11-01");
  assert.equal(s.to, "2026-11-03");
  assert.deepEqual(s.mood, { last: 5, avg: 2.7, min: 1, max: 5 });
  assert.deepEqual(s.bleeding, { last: 2, avg: 2, min: 2, max: 2 });
  assert.equal(s.padDays, 1);
  assert.equal(s.noteDays, 2);
});
test("the summary code has no way to reach Claude or the network", () => {
  const src = fs.readFileSync(new URL("./summary.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /claude|anthropic|fetch\(|narrate/i);
  assert.equal(fs.existsSync(new URL("./claude-summary.ts", import.meta.url)), false);
});

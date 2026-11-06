// Run: node --test lib/calendar.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import { buildMonth, parseMonth, lastDays, dayDetail, parseDay, daysInMonth } from "./calendar.ts";

const today = new Date(2026, 10, 6); // 6 Nov 2026
const ci = (day: string, mood = 3) => ({ day, bleeding: 4, pain: 2, mood, healing: 3, pad_soak: 1, note: "n" });

test("month grid is whole Monday-first weeks; Nov 2026 starts on a Sunday (6 leading blanks)", () => {
  const g = buildMonth(2026, 11, [], []);
  assert.ok(g.weeks.every((w) => w.length === 7));
  assert.equal(g.weeks[0].filter((c) => c === null).length, 6);
  assert.equal(g.weeks[0][6]?.date, "2026-11-01");
  assert.equal(g.weeks.flat().filter(Boolean).length, 30);
});
test("a month starting on Monday has no leading blanks (Jun 2026)", () => {
  const g = buildMonth(2026, 6, [], []);
  assert.equal(g.weeks[0][0]?.date, "2026-06-01");
});
test("leap and short months", () => {
  assert.equal(daysInMonth(2028, 2), 29);
  assert.equal(daysInMonth(2026, 2), 28);
  assert.equal(buildMonth(2028, 2, [], []).weeks.flat().filter(Boolean).length, 29);
  assert.equal(buildMonth(2021, 2, [], []).weeks.length, 4); // Feb 2021: Monday 1st, 28 days
});
test("prev/next cross year boundaries", () => {
  assert.equal(buildMonth(2026, 1, [], []).prev, "2025-12");
  assert.equal(buildMonth(2026, 12, [], []).next, "2027-01");
});
test("a day with check-in and exercise carries her numbers as entered", () => {
  const g = buildMonth(2026, 11, [ci("2026-11-03", 5)], ["2026-11-03", "2026-11-04"]);
  const d = g.weeks.flat().find((c) => c?.date === "2026-11-03")!;
  assert.deepEqual(d.ratings, { bleeding: 4, pain: 2, mood: 5, healing: 3 });
  assert.equal(d.checkedIn, true);
  assert.equal(d.exercised, true);
  assert.equal(d.padSoak, true);
  const e = g.weeks.flat().find((c) => c?.date === "2026-11-04")!;
  assert.equal(e.checkedIn, false);
  assert.equal(e.ratings, undefined);
  assert.equal(e.exercised, true);
  assert.equal(dayDetail("2026-11-03", [ci("2026-11-03")], []).note, "n");
});
test("bad month param falls back to the current month", () => {
  for (const bad of [undefined, "", "2026-13", "2026-00", "abc", "2026-1", "0001-05", ["2026-01"]]) assert.deepEqual(parseMonth(bad, today), { year: 2026, month: 11 });
  assert.deepEqual(parseMonth("2026-03", today), { year: 2026, month: 3 });
});
test("parseDay rejects impossible dates", () => {
  assert.equal(parseDay("2026-02-30"), null);
  assert.equal(parseDay("2026-11-06"), "2026-11-06");
  assert.equal(parseDay(undefined), null);
});
test("lastDays(14) ends today, oldest first, null when no check-in", () => {
  const s = lastDays(14, today, [ci("2026-11-06", 2), ci("2026-10-24", 4)]);
  assert.equal(s.length, 14);
  assert.equal(s[0].date, "2026-10-24");
  assert.equal(s[0].mood, 4);
  assert.equal(s[13].date, "2026-11-06");
  assert.equal(s[13].mood, 2);
  assert.equal(s[5].mood, null);
});

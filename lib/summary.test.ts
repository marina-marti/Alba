// Run: node --test lib/summary.test.ts   (Node built-in runner, no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSummary, MAX_ROWS } from "./summary.ts";

const mk = (i: number, extra: object = {}) => ({
  id: i, day: `2026-11-${String(i).padStart(2, "0")}`, bleeding: 2, pain: 3, mood: 4, healing: 5,
  pad_soak: 0, note: null, created_at: "x", ...extra,
});
const profile = { delivery_date: "2026-10-30", appointment_date: "2026-12-10" };

test("no narrate: narrative null, rows mapped", async () => {
  const r = await buildSummary([mk(2, { pad_soak: 1, note: " dolor " })], profile);
  assert.equal(r.narrative, null);
  assert.deepEqual(r.rows[0], { day: "2026-11-02", bleeding: 2, pain: 3, mood: 4, healing: 5, padSoak: true, note: "dolor" });
});
test("empty: no rows, narrate not called", async () => {
  let called = false;
  const r = await buildSummary([], profile, { narrate: async () => { called = true; return "x"; } });
  assert.deepEqual(r, { rows: [], narrative: null });
  assert.equal(called, false);
});
test("14 check-ins kept; 20 capped to the latest 14, sorted by day", async () => {
  const many = Array.from({ length: 20 }, (_, i) => mk(20 - i));
  const r = await buildSummary(many, profile);
  assert.equal(r.rows.length, MAX_ROWS);
  assert.equal(r.rows[0].day, "2026-11-07");
  assert.equal(r.rows.at(-1)!.day, "2026-11-20");
});
test("narrate receives only check-ins and notes, never the profile", async () => {
  let got: any;
  const r = await buildSummary([mk(1, { note: "a" }), mk(2)], profile, { narrate: async (d) => { got = d; return "texto"; } });
  assert.equal(r.narrative, "texto");
  assert.deepEqual(Object.keys(got).sort(), ["checkins", "notes"]);
  assert.deepEqual(got.notes, [{ day: "2026-11-01", note: "a" }]);
  assert.ok(!JSON.stringify(got).includes("2026-12-10"));
});
test("narrate returning null or throwing", async () => {
  assert.equal((await buildSummary([mk(1)], null, { narrate: async () => null })).narrative, null);
  await assert.rejects(buildSummary([mk(1)], null, { narrate: async () => { throw new Error("fail"); } }));
});

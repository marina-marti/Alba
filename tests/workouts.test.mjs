// Run: node --test tests/   (fake client, no real API)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { weekSinceDelivery, buildPrompt, parseRoutine, getWorkout, DISCLAIMER } from "../lib/workouts-core.ts";

const GROUNDING = fs.readFileSync("content/workouts-grounding.md", "utf8");
const good = JSON.stringify({ title: "Semana", intro: "Con calma.", steps: ["Respira", "Aprieta suave"], sources: ["NHS"] });
const memCache = () => {
  const m = new Map();
  return { get: (w, l) => m.get(`${w}${l}`) ?? null, set: (w, l, r) => m.set(`${w}${l}`, r) };
};

test("week: days 0-6 are week 1, day 7 is week 2", () => {
  assert.equal(weekSinceDelivery("2026-11-01", "2026-11-01").week, 1);
  assert.equal(weekSinceDelivery("2026-11-01", "2026-11-07").week, 1);
  assert.equal(weekSinceDelivery("2026-11-01", "2026-11-08").week, 2);
  assert.equal(weekSinceDelivery("2026-11-01", new Date(2026, 10, 15)).week, 3);
});
test("week: clamps to 1..12 (future date, very old date)", () => {
  assert.equal(weekSinceDelivery("2026-12-01", "2026-11-01").week, 1);
  assert.equal(weekSinceDelivery("2025-01-01", "2026-11-01").week, 12);
  assert.equal(weekSinceDelivery("2026-11-01", "2027-01-24").week, 12);
});
test("week: no profile or bad date -> week 1 and needsProfile", () => {
  for (const d of [null, undefined, "", "mañana"]) {
    assert.deepEqual(weekSinceDelivery(d, "2026-11-01"), { week: 1, needsProfile: true });
  }
  assert.equal(weekSinceDelivery("2026-11-01", "2026-11-01").needsProfile, false);
});
test("prompt: only the week and the grounding, no personal data", () => {
  const p = buildPrompt(6, "es", GROUNDING);
  assert.equal(p.user, "Week number: 6");
  assert.ok(p.system.includes(GROUNDING));
  assert.ok(p.system.endsWith(GROUNDING));
  assert.equal(p.system.split("GROUNDING:\n")[1], GROUNDING);
  assert.doesNotMatch(p.system.split("GROUNDING:\n")[0] + p.user, /check-?in|delivery|whatsapp|\d{4}-\d\d-\d\d/i);
  assert.match(p.system, /never diagnose/i);
  assert.match(p.system, /ask your doctor or promotora/);
  assert.match(p.system, /Spanish/);
  assert.match(buildPrompt(2, "en", GROUNDING).system, /English/);
});
test("grounding file has no forbidden words", () => {
  assert.doesNotMatch(GROUNDING, /postpartum|posparto/i);
});
test("malformed JSON -> parse error, nothing cached", async () => {
  const cache = memCache();
  for (const bad of ["no json", "{oops", '{"title":"x"}', '{"title":"a","intro":"b","steps":[],"sources":["s"]}', '{"title":"a","intro":"b","steps":["x"],"sources":[]}']) {
    const r = await getWorkout({ week: 1, lang: "es", ask: async () => bad, cache, grounding: "g" });
    assert.deepEqual(r, { ok: false, error: "parse" }, bad);
  }
  assert.equal(cache.get(1, "es"), null);
});
test("API throw -> api error", async () => {
  const r = await getWorkout({ week: 1, lang: "es", ask: async () => { throw new Error("timeout"); }, cache: memCache(), grounding: "g" });
  assert.deepEqual(r, { ok: false, error: "api" });
});
test("forbidden words in output -> rejected", () => {
  const bad = JSON.stringify({ title: "Ejercicio posparto", intro: "x", steps: ["y"], sources: ["z"] });
  assert.equal(parseRoutine(bad, "es"), null);
});
test("disclaimer always present, per language; fenced JSON parses", async () => {
  const es = await getWorkout({ week: 2, lang: "es", ask: async () => "```json\n" + good + "\n```", cache: memCache(), grounding: "g" });
  assert.equal(es.routine.disclaimer, DISCLAIMER.es);
  assert.equal(es.routine.disclaimer, "Esto no es consejo médico — pregunta a tu médico o promotora.");
  const en = await getWorkout({ week: 2, lang: "en", ask: async () => good, cache: memCache(), grounding: "g" });
  assert.equal(en.routine.disclaimer, "This is not health advice — ask your doctor or promotora.");
});
test("cache hit avoids a second call; refresh regenerates; separate per week/lang", async () => {
  let calls = 0;
  const ask = async () => { calls++; return good; };
  const cache = memCache();
  const a = await getWorkout({ week: 3, lang: "es", ask, cache, grounding: "g" });
  const b = await getWorkout({ week: 3, lang: "es", ask, cache, grounding: "g" });
  assert.equal(calls, 1);
  assert.equal(a.cached, false);
  assert.equal(b.cached, true);
  await getWorkout({ week: 4, lang: "es", ask, cache, grounding: "g" });
  await getWorkout({ week: 3, lang: "en", ask, cache, grounding: "g" });
  assert.equal(calls, 3);
  await getWorkout({ week: 3, lang: "es", ask, cache, grounding: "g", refresh: true });
  assert.equal(calls, 4);
});

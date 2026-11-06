// Run: node --test tests/   (demo help map, REQ-58: invented places around one fictional rural town)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { rankByDistance, simulateLocation, distanceKm, isFictionalPhone, YOU_START, CLINIC_KINDS } from "../lib/clinics.ts";

const raw = (l) => JSON.parse(fs.readFileSync(`content/demo/clinics.${l}.json`, "utf8"));
const es = raw("es").clinics, en = raw("en").clinics;

test("es and en have the same ids, kinds, costs, positions and phones", () => {
  assert.ok(es.length >= 7 && es.length <= 8);
  assert.deepEqual(en.map((c) => c.id), es.map((c) => c.id));
  assert.deepEqual(en.map((c) => [c.kind, c.cost, c.x, c.y, c.distance_km, c.phone]), es.map((c) => [c.kind, c.cost, c.x, c.y, c.distance_km, c.phone]));
});
test("the town is the fictional Valle Ejemplo, in both languages", () => {
  assert.equal(raw("es").town.name, "Valle Ejemplo");
  assert.equal(raw("en").town.name, "Valle Ejemplo");
  assert.equal(raw("es").town.state, "EE. UU.");
  assert.equal(raw("en").town.state, "USA");
});
test("every place is simulated", () => {
  for (const c of [...es, ...en]) assert.equal(c.simulated, true, c.id);
});
test("exactly the three kinds are present, with at least 2 promotoras, 2 community centers and 2 clinics", () => {
  assert.deepEqual([...new Set(es.map((c) => c.kind))].sort(), [...CLINIC_KINDS].sort());
  for (const k of CLINIC_KINDS) assert.ok(es.filter((c) => c.kind === k).length >= 2, k);
});
test("every place is free or low cost", () => {
  for (const c of [...es, ...en]) assert.ok(c.cost === "free" || c.cost === "low", c.id);
});
test("rural scale distances", () => {
  for (const c of es) assert.ok(c.distance_km >= 0.4 && c.distance_km <= 14, c.id);
});
test("no forbidden words and no Mexico in the content, the clinics.* strings or the map", async () => {
  const { es: ues } = await import("../lib/i18n/es.ts");
  const { en: uen } = await import("../lib/i18n/en.ts");
  const bad = /postpartum|posparto|medical|m[eé]dic|m[eé]xico|mexico/i;
  assert.doesNotMatch(JSON.stringify([raw("es"), raw("en")]), bad);
  for (const d of [ues, uen]) for (const [k, v] of Object.entries(d)) if (k.startsWith("clinics.")) assert.doesNotMatch(v, bad, k);
  assert.doesNotMatch(fs.readFileSync("app/clinicas/ClinicMap.tsx", "utf8"), bad);
});
test("clinics.* keys are identical in es and en", async () => {
  const { es: ues } = await import("../lib/i18n/es.ts");
  const { en: uen } = await import("../lib/i18n/en.ts");
  const keys = (d) => Object.keys(d).filter((k) => k.startsWith("clinics.")).sort();
  assert.deepEqual(keys(uen), keys(ues));
});
test("phones are only the fictional +1 555 01xx range", () => {
  for (const c of [...es, ...en]) assert.ok(isFictionalPhone(c.phone), c.phone);
  assert.ok(!isFictionalPhone("+1 555 0200"));
  assert.ok(!isFictionalPhone("+52 000 000 0001"));
});
test("data distances match the map geometry from the start point", () => {
  for (const c of es) assert.ok(Math.abs(distanceKm(YOU_START, c) - c.distance_km) < 0.051, c.id);
});
test("rankByDistance sorts nearest first and is stable", () => {
  const items = [{ id: "a", distance_km: 1.5 }, { id: "b", distance_km: 1.0 }, { id: "c", distance_km: 1.5 }, { id: "d", distance_km: 1.5 }];
  assert.deepEqual(rankByDistance(items).map((i) => i.id), ["b", "a", "c", "d"]);
  assert.deepEqual(items.map((i) => i.id), ["a", "b", "c", "d"], "input untouched");
});
test("simulateLocation keeps the same places, re-ranked and sorted", () => {
  const out = simulateLocation(es);
  assert.deepEqual(out.map((c) => c.id).sort(), es.map((c) => c.id).sort());
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1].distance_km <= out[i].distance_km);
  assert.notDeepEqual(out.map((c) => c.id), rankByDistance(es).map((c) => c.id));
});

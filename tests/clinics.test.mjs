// Run: node --test tests/   (demo clinic map, REQ-58)
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { rankByDistance, simulateLocation, distanceKm, isFictionalPhone, YOU_START } from "../lib/clinics.ts";

const load = (l) => JSON.parse(fs.readFileSync(`content/demo/clinics.${l}.json`, "utf8")).clinics;
const es = load("es"), en = load("en");

test("clinics es and en have the same ids and positions", () => {
  assert.equal(es.length, 4);
  assert.deepEqual(en.map((c) => c.id), es.map((c) => c.id));
  assert.deepEqual(en.map((c) => [c.x, c.y, c.distance_km, c.phone]), es.map((c) => [c.x, c.y, c.distance_km, c.phone]));
});
test("every clinic is simulated", () => {
  for (const c of [...es, ...en]) assert.equal(c.simulated, true, c.id);
});
test("no forbidden words in the content or the clinics.* strings", async () => {
  const { es: ues } = await import("../lib/i18n/es.ts");
  const { en: uen } = await import("../lib/i18n/en.ts");
  const bad = /postpartum|posparto|medical|m[eé]dic/i;
  assert.doesNotMatch(JSON.stringify([es, en]), bad);
  for (const d of [ues, uen]) for (const [k, v] of Object.entries(d)) if (k.startsWith("clinics.")) assert.doesNotMatch(v, bad, k);
});
test("phones are only the fictional 555 01xx range", () => {
  for (const c of [...es, ...en]) assert.ok(isFictionalPhone(c.phone), c.phone);
  assert.ok(!isFictionalPhone("+1 555 0200"));
  assert.ok(!isFictionalPhone("+1 212 555 0101"));
});
test("data distances match the map geometry from the start point", () => {
  for (const c of es) assert.ok(Math.abs(distanceKm(YOU_START, c) - c.distance_km) < 0.051, c.id);
});
test("rankByDistance sorts nearest first and is stable", () => {
  const items = [{ id: "a", distance_km: 1.5 }, { id: "b", distance_km: 1.0 }, { id: "c", distance_km: 1.5 }, { id: "d", distance_km: 1.5 }];
  assert.deepEqual(rankByDistance(items).map((i) => i.id), ["b", "a", "c", "d"]);
  assert.deepEqual(items.map((i) => i.id), ["a", "b", "c", "d"], "input untouched");
});
test("simulateLocation keeps the same clinics, re-ranked and sorted", () => {
  const out = simulateLocation(es);
  assert.deepEqual(out.map((c) => c.id).sort(), es.map((c) => c.id).sort());
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1].distance_km <= out[i].distance_km);
  assert.notDeepEqual(out.map((c) => c.id), rankByDistance(es).map((c) => c.id));
});

// Run: node --test lib/today.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { dayNumber, daysSince, weekOf, clampWeek, longDate, weekLine } from "./today.ts";

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h, 30);

test("daysSince counts whole calendar days, ignoring time of day", () => {
  assert.equal(daysSince("2026-10-25", at(2026, 11, 6)), 12);
  assert.equal(daysSince("2026-11-06", at(2026, 11, 6, 0)), 0);
  assert.equal(daysSince("2026-11-05", at(2026, 11, 6, 23)), 1);
});
test("daysSince across month and year ends and leap day", () => {
  assert.equal(daysSince("2025-12-31", at(2026, 1, 1)), 1);
  assert.equal(daysSince("2024-02-28", at(2024, 3, 1)), 2);
});
test("daysSince is null for missing, invalid or future dates", () => {
  assert.equal(daysSince(null, at(2026, 11, 6)), null);
  assert.equal(daysSince("", at(2026, 11, 6)), null);
  assert.equal(daysSince("nope", at(2026, 11, 6)), null);
  assert.equal(daysSince("2026-02-30", at(2026, 11, 6)), null);
  assert.equal(daysSince("2026-11-07", at(2026, 11, 6)), null);
  assert.equal(dayNumber("2026-13-01"), null);
});
test("week 1 = days 0-6", () => {
  assert.equal(weekOf(0), 1);
  assert.equal(weekOf(6), 1);
  assert.equal(weekOf(7), 2);
  assert.equal(weekOf(12), 2);
  assert.equal(weekOf(13), 2);
  assert.equal(weekOf(14), 3);
  assert.equal(weekOf(100), 15);
});
test("clampWeek only bounds 1..12", () => {
  assert.equal(clampWeek(0), 1);
  assert.equal(clampWeek(2), 2);
  assert.equal(clampWeek(15), 12);
});
test("weekLine wording, plural and singular, never the banned words", () => {
  assert.equal(weekLine(12, "es"), "Semana 2 (12 días desde el parto)");
  assert.equal(weekLine(1, "es"), "Semana 1 (1 día desde el parto)");
  assert.equal(weekLine(12, "en"), "Week 2 (12 days since birth)");
  assert.equal(weekLine(1, "en"), "Week 1 (1 day since birth)");
  for (const l of ["es", "en"] as const) assert.doesNotMatch(weekLine(5, l), /postpartum|posparto|medical/i);
});
test("longDate in both languages", () => {
  assert.equal(longDate(at(2026, 11, 6), "es"), "Viernes, 6 de noviembre");
  assert.equal(longDate(at(2026, 11, 6), "en"), "Friday, November 6");
});

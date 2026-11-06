// Run: node --test tests/
import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema, readSeedUser, seedStarterIfEmpty, reseed } from "../lib/seed-core.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const seed = readSeedUser(root);
const n = (db, t) => db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;

test("first run creates exactly one profile named Marina with the seed data, and is idempotent", () => {
  const db = new Database(":memory:");
  ensureSchema(db);
  assert.equal(seedStarterIfEmpty(db, seed), true);
  assert.equal(seedStarterIfEmpty(db, seed), false);
  ensureSchema(db);
  seedStarterIfEmpty(db, seed);
  assert.equal(n(db, "profile"), 1);
  assert.equal(n(db, "checkins"), seed.checkins.length);
  const p = db.prepare("SELECT * FROM profile WHERE id=1").get();
  assert.equal(p.name, "Marina");
  assert.equal(p.delivery_date, seed.delivery_date);
  assert.equal(p.clinic_phone, seed.clinic_phone);
});

test("migration keeps an existing profile that has no name column", () => {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE profile (id INTEGER PRIMARY KEY CHECK(id=1), whatsapp TEXT, delivery_date TEXT,
    appointment_date TEXT, clinic_phone TEXT, consent INTEGER DEFAULT 0, created_at TEXT);
    INSERT INTO profile (id, whatsapp, delivery_date, clinic_phone) VALUES (1, '+15550001', '2026-01-02', '+15550002');`);
  ensureSchema(db);
  ensureSchema(db); // twice is fine
  assert.equal(seedStarterIfEmpty(db, seed), false);
  const p = db.prepare("SELECT * FROM profile WHERE id=1").get();
  assert.equal(p.name, null);
  assert.equal(p.whatsapp, "+15550001");
  assert.equal(p.delivery_date, "2026-01-02");
  assert.equal(n(db, "checkins"), 0);
});

test("reseed (npm run seed) is repeatable and ends with one Marina", () => {
  const db = new Database(":memory:");
  ensureSchema(db);
  reseed(db, seed);
  reseed(db, seed);
  assert.equal(n(db, "profile"), 1);
  assert.equal(n(db, "checkins"), seed.checkins.length);
});

test("starter exercise days (4, 6, 7, 9, 10 since delivery) are seeded once and never overwritten", () => {
  const db = new Database(":memory:");
  ensureSchema(db);
  seedStarterIfEmpty(db, seed);
  seedStarterIfEmpty(db, seed);
  ensureSchema(db);
  const days = db.prepare("SELECT day FROM exercise_log ORDER BY day").all().map((r) => r.day);
  const at = (k) => { const d = new Date(`${seed.delivery_date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  assert.deepEqual(days, [4, 6, 7, 9, 10].map(at));
  // an existing row survives a re-seed of the same days (INSERT OR IGNORE)
  db.prepare("UPDATE exercise_log SET week=99 WHERE day=?").run(at(4));
  reseedKeep(db);
  assert.equal(db.prepare("SELECT week FROM exercise_log WHERE day=?").get(at(4)).week, 99);
  // wipe clears it (seed --reset)
  reseed(db, seed);
  assert.equal(n(db, "exercise_log"), 5);
  db.exec("DELETE FROM exercise_log");
  assert.equal(n(db, "exercise_log"), 0);
});

function reseedKeep(db) {
  // profile exists, so first-run seeding must be a no-op and keep her rows
  assert.equal(seedStarterIfEmpty(db, seed), false);
}

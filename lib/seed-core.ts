// Shared by lib/db.ts (first-run starter user) and scripts/seed.mjs (npm run seed).
// No server-only import and erasable TS only, so node:test and plain node can load it.
import type Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export const STARTER_NAME = "Marina";

export type SeedUser = {
  whatsapp: string;
  delivery_date: string;
  appointment_date: string;
  clinic_phone: string;
  consent: boolean;
  checkins: { day: number; bleeding: number; pain: number; mood: number; healing: number; pad_soak: number; note?: string | null }[];
};

export function readSeedUser(root: string): SeedUser {
  return JSON.parse(fs.readFileSync(path.join(root, "content", "demo", "seed-user.json"), "utf8"));
}

/** Creates the tables and adds profile.name when missing. Never drops or rewrites data. */
export function ensureSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK(id=1),
      name TEXT, whatsapp TEXT, delivery_date TEXT, appointment_date TEXT, clinic_phone TEXT,
      consent INTEGER DEFAULT 0, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT, bleeding INTEGER, pain INTEGER, mood INTEGER, healing INTEGER,
      pad_soak INTEGER, note TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sim_circle_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, alias TEXT, text TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS sim_checklist (item_id TEXT PRIMARY KEY, done INTEGER DEFAULT 0, updated_at TEXT);
    CREATE TABLE IF NOT EXISTS sim_confirmations (kind TEXT PRIMARY KEY, confirmed_at TEXT);
  `);
  const cols = db.prepare("PRAGMA table_info(profile)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "name")) db.exec("ALTER TABLE profile ADD COLUMN name TEXT");
}

/** "day" in the seed is days since delivery; returns the ISO timestamp for that day. */
function dayDate(seed: SeedUser, n: number): string {
  const d = new Date(`${seed.delivery_date}T09:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
}

function insertSeed(db: Database.Database, seed: SeedUser): void {
  db.prepare(
    `INSERT OR IGNORE INTO profile (id, name, whatsapp, delivery_date, appointment_date, clinic_phone, consent, created_at)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?)`
  ).run(STARTER_NAME, seed.whatsapp, seed.delivery_date, seed.appointment_date, seed.clinic_phone, seed.consent ? 1 : 0, dayDate(seed, 0));
  const has = (db.prepare("SELECT COUNT(*) c FROM checkins").get() as { c: number }).c;
  if (has > 0) return; // never touch check-ins that already exist
  const ins = db.prepare(
    `INSERT INTO checkins (day, bleeding, pain, mood, healing, pad_soak, note, created_at) VALUES (?,?,?,?,?,?,?,?)`
  );
  for (const c of seed.checkins) {
    ins.run(dayDate(seed, c.day).slice(0, 10), c.bleeding, c.pain, c.mood, c.healing, c.pad_soak, c.note ?? null, dayDate(seed, c.day));
  }
}

/** First run only: when the profile table is empty, create the starter user. Returns true if it did. */
export function seedStarterIfEmpty(db: Database.Database, seed: SeedUser): boolean {
  const empty = () => (db.prepare("SELECT COUNT(*) c FROM profile").get() as { c: number }).c === 0;
  if (!empty()) return false;
  db.transaction(() => {
    if (empty()) insertSeed(db, seed);
  }).immediate();
  return true;
}

export const TABLES = ["checkins", "profile", "sim_circle_posts", "sim_checklist", "sim_confirmations"];

export function wipeAll(db: Database.Database): void {
  db.transaction(() => {
    for (const t of TABLES) db.prepare(`DELETE FROM ${t}`).run();
    db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('checkins','sim_circle_posts')").run();
  })();
}

/** Wipe, then load the starter user (what `npm run seed` does). */
export function reseed(db: Database.Database, seed: SeedUser): void {
  wipeAll(db);
  db.transaction(() => insertSeed(db, seed))();
}

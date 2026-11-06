// Seeds the single demo user (content/demo/seed-user.json) into data/alba.db.
// Usage: node scripts/seed.mjs [--reset]
// Table definitions mirror lib/db.ts and lib/simulated.ts exactly (those are server-only TS modules).
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data");
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, "alba.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK(id=1),
    whatsapp TEXT, delivery_date TEXT, appointment_date TEXT, clinic_phone TEXT,
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

const wipe = db.transaction(() => {
  for (const t of ["checkins", "profile", "sim_circle_posts", "sim_checklist", "sim_confirmations"]) {
    db.prepare(`DELETE FROM ${t}`).run();
  }
  db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('checkins','sim_circle_posts')").run();
});

function counts() {
  const n = (t) => db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;
  return `profile=${n("profile")} checkins=${n("checkins")} sim_circle_posts=${n("sim_circle_posts")} sim_checklist=${n("sim_checklist")} sim_confirmations=${n("sim_confirmations")}`;
}

if (process.argv.includes("--reset")) {
  wipe();
  console.log(`Reset done. ${counts()}`);
  process.exit(0);
}

const seed = JSON.parse(fs.readFileSync(path.join(root, "content", "demo", "seed-user.json"), "utf8"));
// "day" in the seed is days since delivery; the app stores an ISO date string (sorts correctly).
const dayDate = (n) => {
  const d = new Date(`${seed.delivery_date}T09:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString();
};

db.transaction(() => {
  wipe();
  db.prepare(
    `INSERT INTO profile (id, whatsapp, delivery_date, appointment_date, clinic_phone, consent, created_at)
     VALUES (1, ?, ?, ?, ?, ?, ?)`
  ).run(seed.whatsapp, seed.delivery_date, seed.appointment_date, seed.clinic_phone, seed.consent ? 1 : 0, dayDate(0));
  const ins = db.prepare(
    `INSERT INTO checkins (day, bleeding, pain, mood, healing, pad_soak, note, created_at)
     VALUES (?,?,?,?,?,?,?,?)`
  );
  for (const c of seed.checkins) {
    ins.run(dayDate(c.day).slice(0, 10), c.bleeding, c.pain, c.mood, c.healing, c.pad_soak, c.note ?? null, dayDate(c.day));
  }
})();
console.log(`Seeded demo user. ${counts()}`);

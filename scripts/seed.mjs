// Seeds the starter user (content/demo/seed-user.json) into data/alba.db.
// Usage: node scripts/seed.mjs [--reset]
// Schema and seeding logic live in lib/seed-core.ts (shared with lib/db.ts, which seeds the same user on first run).
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TABLES, ensureSchema, readSeedUser, reseed, wipeAll } from "../lib/seed-core.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data");
fs.mkdirSync(dir, { recursive: true });
const db = new Database(path.join(dir, "alba.db"));
db.pragma("journal_mode = WAL");
ensureSchema(db);

function counts() {
  return TABLES.map((t) => `${t}=${db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c}`).join(" ");
}

if (process.argv.includes("--reset")) {
  wipeAll(db);
  console.log(`Reset done. ${counts()}`);
  process.exit(0);
}

reseed(db, readSeedUser(root));
console.log(`Seeded starter user. ${counts()}`);

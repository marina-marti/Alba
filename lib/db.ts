import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { ensureSchema, readSeedUser, seedStarterIfEmpty } from "@/lib/seed-core";

export type Profile = {
  name: string | null;
  whatsapp: string | null;
  delivery_date: string | null;
  appointment_date: string | null;
  clinic_phone: string | null;
  consent: number;
  created_at: string | null;
};

export type CheckinInput = {
  day: string;
  bleeding: number;
  pain: number;
  mood: number;
  healing: number;
  pad_soak: number; // 0 / 1
  note?: string | null;
};
export type Checkin = CheckinInput & { id: number; created_at: string };

const globalForDb = globalThis as unknown as { __albaDb?: Database.Database };

function open(): Database.Database {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  const db = new Database(path.join(dir, "alba.db"));
  db.pragma("journal_mode = WAL");
  ensureSchema(db); // creates tables, adds profile.name if missing
  seedStarterIfEmpty(db, readSeedUser(process.cwd())); // first run: the starter user
  return db;
}

export function getDb(): Database.Database {
  return (globalForDb.__albaDb ??= open());
}

export function getProfile(): Profile | null {
  return (getDb().prepare("SELECT name, whatsapp, delivery_date, appointment_date, clinic_phone, consent, created_at FROM profile WHERE id=1").get() as Profile | undefined) ?? null;
}

export function saveProfile(p: Partial<Omit<Profile, "created_at">>): void {
  const cur = getProfile();
  const next = {
    name: p.name ?? cur?.name ?? null,
    whatsapp: p.whatsapp ?? cur?.whatsapp ?? null,
    delivery_date: p.delivery_date ?? cur?.delivery_date ?? null,
    appointment_date: p.appointment_date ?? cur?.appointment_date ?? null,
    clinic_phone: p.clinic_phone ?? cur?.clinic_phone ?? null,
    consent: p.consent ?? cur?.consent ?? 0,
    created_at: cur?.created_at ?? new Date().toISOString(),
  };
  getDb()
    .prepare(
      `INSERT INTO profile (id, name, whatsapp, delivery_date, appointment_date, clinic_phone, consent, created_at)
       VALUES (1, @name, @whatsapp, @delivery_date, @appointment_date, @clinic_phone, @consent, @created_at)
       ON CONFLICT(id) DO UPDATE SET name=@name, whatsapp=@whatsapp, delivery_date=@delivery_date,
         appointment_date=@appointment_date, clinic_phone=@clinic_phone, consent=@consent`
    )
    .run(next);
}

export function addCheckin(c: CheckinInput): number {
  const r = getDb()
    .prepare(
      `INSERT INTO checkins (day, bleeding, pain, mood, healing, pad_soak, note, created_at)
       VALUES (@day, @bleeding, @pain, @mood, @healing, @pad_soak, @note, @created_at)`
    )
    .run({ ...c, note: c.note ?? null, created_at: new Date().toISOString() });
  return Number(r.lastInsertRowid);
}

export function listCheckins(): Checkin[] {
  return getDb().prepare("SELECT * FROM checkins ORDER BY day ASC, id ASC").all() as Checkin[];
}

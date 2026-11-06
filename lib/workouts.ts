import "server-only";
import { askClaude } from "./claude";
import { getDb, getProfile } from "./db";
import { getWorkout, weekSinceDelivery, type Cache, type Lang, type Routine } from "./workouts-core";

// Own table, created on first use (T-009). Cached per (week, lang) so the demo is stable and cheap.
function table() {
  const db = getDb();
  db.exec(`CREATE TABLE IF NOT EXISTS workout_cache (
    week INTEGER, lang TEXT, routine TEXT, created_at TEXT, PRIMARY KEY (week, lang)
  )`);
  return db;
}

const sqliteCache: Cache = {
  get(week, lang) {
    const row = table().prepare("SELECT routine FROM workout_cache WHERE week=? AND lang=?").get(week, lang) as { routine: string } | undefined;
    if (!row) return null;
    try {
      return JSON.parse(row.routine) as Routine;
    } catch {
      return null;
    }
  },
  set(week, lang, r) {
    table()
      .prepare("INSERT OR REPLACE INTO workout_cache (week, lang, routine, created_at) VALUES (?,?,?,?)")
      .run(week, lang, JSON.stringify(r), new Date().toISOString());
  },
};

function localToday(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Her current week from the profile (week 1 and needsProfile when there is none). */
export function currentWeek() {
  return weekSinceDelivery(getProfile()?.delivery_date, localToday());
}

export function workoutFor(week: number, lang: Lang, refresh = false) {
  return getWorkout({ week, lang, ask: askClaude, cache: sqliteCache, refresh });
}

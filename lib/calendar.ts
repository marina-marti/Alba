// Pure calendar helpers for the dashboard (REQ-57). No imports, so node:test can load it.
// Her own numbers only: no score, trend label or verdict (OOS-1, Q-47).

export type CheckinRow = { day: string; bleeding: number; pain: number; mood: number; healing: number; pad_soak: number; note?: string | null };
export type Ratings = { bleeding: number; pain: number; mood: number; healing: number };
export type CalDay = {
  date: string; // YYYY-MM-DD
  checkedIn: boolean;
  exercised: boolean;
  ratings?: Ratings;
  padSoak: boolean;
  note?: string | null;
};
export type MonthGrid = { year: number; month: number; key: string; prev: string; next: string; weeks: (CalDay | null)[][] };

const p2 = (n: number) => String(n).padStart(2, "0");

export function isoOf(y: number, m: number, d: number): string {
  return `${y}-${p2(m)}-${p2(d)}`;
}

/** Local calendar date of a Date as YYYY-MM-DD. */
export function isoLocal(d: Date): string {
  return isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/** Valid "YYYY-MM-DD" (real calendar day) or null. */
export function parseDay(s: unknown): string | null {
  const m = typeof s === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(s) : null;
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === d ? (s as string) : null;
}

/** "YYYY-MM" -> {year, month}; anything bad falls back to the month of `today`. */
export function parseMonth(s: unknown, today: Date): { year: number; month: number } {
  const m = typeof s === "string" ? /^(\d{4})-(\d{2})$/.exec(s) : null;
  if (m && Number(m[1]) >= 1900 && Number(m[1]) <= 2200 && Number(m[2]) >= 1 && Number(m[2]) <= 12) return { year: Number(m[1]), month: Number(m[2]) };
  return { year: today.getFullYear(), month: today.getMonth() + 1 };
}

export function monthKey(y: number, m: number): string {
  return `${y}-${p2(m)}`;
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function shiftMonth(y: number, m: number, by: number): string {
  const t = new Date(Date.UTC(y, m - 1 + by, 1));
  return monthKey(t.getUTCFullYear(), t.getUTCMonth() + 1);
}

function dayOf(date: string, checks: Map<string, CheckinRow>, ex: Set<string>): CalDay {
  const c = checks.get(date);
  return {
    date,
    checkedIn: !!c,
    exercised: ex.has(date),
    ratings: c ? { bleeding: c.bleeding, pain: c.pain, mood: c.mood, healing: c.healing } : undefined,
    padSoak: !!c && c.pad_soak === 1,
    note: c?.note ?? null,
  };
}

/** Latest check-in per day wins (rows are in insertion order). */
function byDay(checkins: CheckinRow[]): Map<string, CheckinRow> {
  const m = new Map<string, CheckinRow>();
  for (const c of checkins) m.set(c.day, c);
  return m;
}

/** Month grid, weeks start on Monday; cells outside the month are null. */
export function buildMonth(year: number, month: number, checkins: CheckinRow[], exerciseDays: Iterable<string>): MonthGrid {
  const checks = byDay(checkins);
  const ex = new Set(exerciseDays);
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7; // Monday = 0
  const cells: (CalDay | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth(year, month); d++) cells.push(dayOf(isoOf(year, month, d), checks, ex));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (CalDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { year, month, key: monthKey(year, month), prev: shiftMonth(year, month, -1), next: shiftMonth(year, month, 1), weeks };
}

export function dayDetail(date: string, checkins: CheckinRow[], exerciseDays: Iterable<string>): CalDay {
  return dayOf(date, byDay(checkins), new Set(exerciseDays));
}

export type StripDay = { date: string; mood: number | null; pain: number | null };

/** The last n days ending on `today` (oldest first), with her mood and pain when she checked in. */
export function lastDays(n: number, today: Date, checkins: CheckinRow[]): StripDay[] {
  const checks = byDay(checkins);
  const out: StripDay[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = isoLocal(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
    const c = checks.get(date);
    out.push({ date, mood: c ? c.mood : null, pain: c ? c.pain : null });
  }
  return out;
}

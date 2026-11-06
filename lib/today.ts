// Pure date helpers for the home "today" circle. No imports, so node:test can load it directly.
// Rule (same as workouts): week 1 = days 0-6, so week = floor(days / 7) + 1.

export type Lang = "es" | "en";

/** Parse "YYYY-MM-DD" (or an ISO string starting with it) into a UTC day number, or null. */
export function dayNumber(iso: string | null | undefined): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? "");
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return Math.floor(t / 86_400_000);
}

/** Calendar day number of a Date in its own local time zone. */
export function localDayNumber(now: Date): number {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
}

/** Whole days since delivery; null when the date is missing, invalid or in the future. */
export function daysSince(delivery: string | null | undefined, now: Date): number | null {
  const d = dayNumber(delivery);
  if (d === null) return null;
  const n = localDayNumber(now) - d;
  return n < 0 ? null : n;
}

/** Week number, week 1 = days 0-6. Not clamped. */
export function weekOf(days: number): number {
  return Math.floor(days / 7) + 1;
}

/** Clamp to 1..12, only for week-based links. */
export function clampWeek(week: number): number {
  return Math.min(12, Math.max(1, week));
}

/** "viernes, 6 de noviembre" / "Friday, November 6" */
export function longDate(now: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-ES", { weekday: "long", day: "numeric", month: "long" }).format(now);
}

/** "Semana 2 (12 días desde el parto)" / "Week 2 (12 days since birth)" */
export function weekLine(days: number, lang: Lang): string {
  const w = weekOf(days);
  if (lang === "en") return `Week ${w} (${days} ${days === 1 ? "day" : "days"} since birth)`;
  return `Semana ${w} (${days} ${days === 1 ? "día" : "días"} desde el parto)`;
}

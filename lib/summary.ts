// The ONE seam for the one-page summary (REQ-6). Pure: no DB, no network.
// A later ticket passes `narrate`; it receives check-ins and notes only (AC-78).
import type { Checkin } from "./db";

export const MAX_ROWS = 14; // fits one printed page; period is TBD -> Q-18

export type SummaryRow = {
  day: string;
  bleeding: number;
  pain: number;
  mood: number;
  healing: number;
  padSoak: boolean;
  note: string;
};
export type NarrateData = { checkins: SummaryRow[]; notes: { day: string; note: string }[] };
export type SummaryProfile = { delivery_date: string | null; appointment_date: string | null } | null;
export type SummaryResult = { rows: SummaryRow[]; narrative: string | null };

export async function buildSummary(
  checkins: Checkin[],
  _profile: SummaryProfile,
  opts?: { narrate?: (data: NarrateData) => Promise<string | null> },
): Promise<SummaryResult> {
  const sorted = [...checkins].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : a.id - b.id));
  const rows: SummaryRow[] = sorted.slice(-MAX_ROWS).map((c) => ({
    day: c.day,
    bleeding: c.bleeding,
    pain: c.pain,
    mood: c.mood,
    healing: c.healing,
    padSoak: c.pad_soak === 1,
    note: (c.note ?? "").trim(),
  }));
  if (!opts?.narrate || rows.length === 0) return { rows, narrative: null };
  // Only check-ins and notes leave this function (AC-78); profile is never passed.
  const notes = rows.filter((r) => r.note).map((r) => ({ day: r.day, note: r.note }));
  const narrative = await opts.narrate({ checkins: rows, notes });
  return { rows, narrative: narrative ?? null };
}

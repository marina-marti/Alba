// The one-page summary (REQ-6), built locally from her own check-ins. Pure: no DB, no network.
// Nothing here is sent anywhere: the AI narration was removed on purpose (D19:L1, data leakage).
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
export type SummaryProfile = { delivery_date: string | null; appointment_date: string | null } | null;
export type SummaryResult = { rows: SummaryRow[] };

export function buildSummary(checkins: Checkin[], _profile: SummaryProfile): SummaryResult {
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
  return { rows };
}

export type MetricStats = { last: number; avg: number; min: number; max: number };
export type SummaryStats = {
  n: number;
  from: string;
  to: string;
  bleeding: MetricStats;
  pain: MetricStats;
  mood: MetricStats;
  healing: MetricStats;
  padDays: number;
  noteDays: number;
};

function metric(values: number[]): MetricStats {
  const sum = values.reduce((a, b) => a + b, 0);
  return { last: values[values.length - 1], avg: Math.round((sum / values.length) * 10) / 10, min: Math.min(...values), max: Math.max(...values) };
}

/** Plain numbers from her own entries (no judgement, no advice). Rows must be in day order, as buildSummary returns them. */
export function summaryStats(rows: SummaryRow[]): SummaryStats | null {
  if (rows.length === 0) return null;
  return {
    n: rows.length,
    from: rows[0].day,
    to: rows[rows.length - 1].day,
    bleeding: metric(rows.map((r) => r.bleeding)),
    pain: metric(rows.map((r) => r.pain)),
    mood: metric(rows.map((r) => r.mood)),
    healing: metric(rows.map((r) => r.healing)),
    padDays: rows.filter((r) => r.padSoak).length,
    noteDays: rows.filter((r) => r.note).length,
  };
}

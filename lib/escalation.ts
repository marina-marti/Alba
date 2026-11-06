import type { Checkin, CheckinInput } from "./db";

export type Escalation = "pad" | "mood" | "selfharm";

function norm(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Matched on normalized text (no accents, lower case).
const SELF_HARM = [
  /hacerme\s+dano/,
  /hacerle\s+dano/,
  /hacerles\s+dano/,
  /lastimarme/,
  /lastimar\s+(a|al)\s+(mi\s+)?bebe/,
  /quitarme\s+la\s+vida/,
  /quitarle\s+la\s+vida/,
  /matarme/,
  /no\s+quiero\s+vivir/,
  /suicid/,
  /self[\s-]?harm/,
  /hurt(ing)?\s+(myself|my\s+baby|the\s+baby)/,
  /harm(ing)?\s+(myself|my\s+baby|the\s+baby)/,
  /kill(ing)?\s+myself/,
  /end\s+my\s+life/,
];

export function mentionsSelfHarm(note: string | null | undefined): boolean {
  if (!note) return false;
  const t = norm(note);
  return SELF_HARM.some((r) => r.test(t));
}

const low = (m: number | null | undefined) => m === 1 || m === 2;

/**
 * history = earlier check-ins (any order). If it also contains the latest
 * (same id), that row is ignored. Priority: selfharm > pad > mood.
 */
export function escalationFor(latest: CheckinInput, history: Checkin[]): Escalation | null {
  if (mentionsSelfHarm(latest.note)) return "selfharm";
  if (latest.pad_soak === 1) return "pad";
  if (low(latest.mood)) {
    const latestId = (latest as Partial<Checkin>).id;
    const prior = history
      .filter((c) => latestId == null || c.id !== latestId)
      .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "") || b.id - a.id)[0];
    if (prior && low(prior.mood)) return "mood";
  }
  return null;
}

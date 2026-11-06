// T-009 pelvic floor routine by week. Pure logic, no Next/server-only imports, so node:test can run it.
// The Claude client and the cache are injected (lib/workouts.ts wires the real ones).
import fs from "node:fs";
import path from "node:path";

export type Lang = "es" | "en";
export type Routine = { title: string; intro: string; steps: string[]; sources: string[]; disclaimer: string };
export type AskFn = (input: { system: string; messages: { role: "user"; content: string }[]; timeoutMs: number; maxTokens: number }) => Promise<string>;
export type Cache = { get(week: number, lang: Lang): Routine | null; set(week: number, lang: Lang, r: Routine): void };
export type WorkoutResult = { ok: true; routine: Routine; cached: boolean } | { ok: false; error: "api" | "parse" };

export const DISCLAIMER: Record<Lang, string> = {
  es: "Esto no es consejo médico — pregunta a tu médico o promotora.",
  en: "This is not health advice — ask your doctor or promotora.",
};
export const WORKOUT_TIMEOUT_MS = 5000;
export const MIN_WEEK = 1;
export const MAX_WEEK = 12;
const FORBIDDEN = /postpartum|posparto|post-partum|post-parto/i;

/** Week 1 = days 0-6 since delivery; clamped to 1..12. No (or unreadable) date -> week 1 and needsProfile. */
export function weekSinceDelivery(deliveryDate: string | null | undefined, today: string | Date): { week: number; needsProfile: boolean } {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(deliveryDate ?? "");
  if (!m) return { week: MIN_WEEK, needsProfile: true };
  const d0 = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  let t: number;
  if (typeof today === "string") {
    const n = /^(\d{4})-(\d{2})-(\d{2})/.exec(today);
    if (!n) return { week: MIN_WEEK, needsProfile: true };
    t = Date.UTC(+n[1], +n[2] - 1, +n[3]);
  } else {
    t = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  }
  const days = Math.floor((t - d0) / 86400000);
  const week = Math.floor(days / 7) + 1;
  return { week: Math.min(MAX_WEEK, Math.max(MIN_WEEK, week)), needsProfile: false };
}

export function loadGrounding(): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "workouts-grounding.md"), "utf8");
}

/** The prompt carries ONLY the week number and the grounding text. Nothing about her (D7:L3). */
export function buildPrompt(week: number, lang: Lang, grounding: string): { system: string; user: string } {
  const out = lang === "en" ? "English" : "Spanish";
  const system = [
    "You write a short, gentle pelvic floor routine for a mother, for one week after birth.",
    "This is tracking and information only. Never diagnose.",
    "Use ONLY what the grounding text below states. Do not add exercises, numbers or advice that it does not contain.",
    "Where the sources differ, or give no schedule for something, say 'ask your doctor or promotora' for that part instead of choosing.",
    "Never advise abdominal exercises, running or lifting. If the week suggests them, say to ask her doctor or promotora.",
    "If the grounding says to stop and speak to a clinician (pain, heaviness, bulging, incontinence, trouble passing urine), include that.",
    "Frame the routine as gentle rest, the cuarentena: slow, small, with plenty of rest.",
    "Name the grounding sources you used, by name, in 'sources'.",
    "Never write the words 'postpartum' or 'posparto'.",
    `Write all text in ${out}. Do not write a disclaimer; the app adds it.`,
    'Reply with strict JSON only, no markdown fences: {"title": string, "intro": string, "steps": [string], "sources": [string]}. Be brief: title under 8 words, intro under 30 words, exactly 4 steps of under 25 words each, at most 3 sources.',
    "",
    "GROUNDING:",
    grounding,
  ].join("\n");
  return { system, user: `Week number: ${week}` };
}

function strs(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const a = v.map((x) => (typeof x === "string" ? x.trim() : "")).filter(Boolean);
  return a.length === v.length ? a : null;
}

/** Defensive parse. Returns null for anything unusable (never invents content). */
export function parseRoutine(text: string, lang: Lang): Routine | null {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  let j: unknown;
  try {
    j = JSON.parse(text.slice(s, e + 1));
  } catch {
    return null;
  }
  if (!j || typeof j !== "object") return null;
  const o = j as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const intro = typeof o.intro === "string" ? o.intro.trim() : "";
  const steps = strs(o.steps)?.filter((x) => x !== DISCLAIMER[lang]) ?? null;
  const sources = strs(o.sources);
  if (!title || !intro || !steps || steps.length === 0 || !sources || sources.length === 0) return null;
  if (FORBIDDEN.test([title, intro, ...steps, ...sources].join(" "))) return null;
  return { title, intro, steps, sources, disclaimer: DISCLAIMER[lang] };
}

export async function getWorkout(opts: {
  week: number;
  lang: Lang;
  ask: AskFn;
  cache: Cache;
  grounding?: string;
  refresh?: boolean;
}): Promise<WorkoutResult> {
  const { week, lang, ask, cache, refresh } = opts;
  if (!refresh) {
    const hit = cache.get(week, lang);
    if (hit) return { ok: true, routine: hit, cached: true };
  }
  const { system, user } = buildPrompt(week, lang, opts.grounding ?? loadGrounding());
  let text: string;
  try {
    text = await ask({ system, messages: [{ role: "user", content: user }], timeoutMs: WORKOUT_TIMEOUT_MS, maxTokens: 700 });
  } catch {
    return { ok: false, error: "api" };
  }
  const routine = parseRoutine(text, lang);
  if (!routine) return { ok: false, error: "parse" };
  cache.set(week, lang, routine);
  return { ok: true, routine, cached: false };
}

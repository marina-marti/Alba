// Ask Alba server logic (T-006). answerQuestion() is the ONLY seam T-007 extends:
// pass a `generate` function to use Claude. No imports of Next/server-only so node:test can run it.
import fs from "node:fs";
import path from "node:path";

export type Guardrails = { question: string; page: string; rules: string; guardrails: GuardrailsFile };
export type GuardrailsFile = {
  language_rule: string;
  cite_source: string;
  never_diagnose: string;
  red_flag: { rule: string; phrase: string };
  low_mood: { rule: string; hotline: string; also: string };
  unsure_phrase: string;
  disclaimer: string;
};
type SeedItem = {
  id: string; live: boolean; question: string; answer: string; source: string;
  match?: { all_of_groups_any: string[][] }; // English seed items only
};

export type GenerateInput = { question: string; page: string; guardrails: GuardrailsFile };
export type GenerateFn = (q: GenerateInput) => Promise<string | null>;
export type AskResult = { answer: string; source: string; usedSeed: boolean; lang: "es" | "en"; kind: string };

export const GENERATE_TIMEOUT_MS = 5000;

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", file), "utf8")) as T;
}
export function loadGuardrails(lang: "es" | "en" = "es"): GuardrailsFile {
  return readJson<GuardrailsFile>(`guardrails.${lang}.json`);
}
export function loadSeed(lang: "es" | "en" = "es"): { disclaimer: string; items: SeedItem[] } {
  return readJson(lang === "en" ? "seed-qa.en.json" : "seed-qa.json");
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EN_WORDS = /\b(the|is|are|my|can|i|am|what|when|how|why|do|does|should|it|this|normal|baby|bleeding|sad|sleep|tea|feel|have|has|soaking|pad|hour|every|and|to|for|in|of|a|pain|chest|fever|headache|clots?|breathe|breathing|blurred|severe|since|morning|hurt|myself|overwhelmed|anxious|hopeless|depressed|weather|so|with|on|at|if|will|dye|hair|week)\b/g;
const ES_WORDS = /\b(el|la|los|las|es|esta|este|mi|puedo|que|como|cuando|por|para|una|un|de|en|y|me|no|se|con|sangrado|dia|siento|triste|dormir|te|tengo|tomar|familia)\b/g;
export function detectLanguage(question: string): "es" | "en" {
  if (/[¿¡ñáéíóúü]/i.test(question)) return "es";
  const n = normalize(question);
  const en = (n.match(EN_WORDS) ?? []).length;
  const es = (n.match(ES_WORDS) ?? []).length;
  return en > es ? "en" : "es";
}

const RED_FLAGS: RegExp[] = [
  /empap\w*.*(toalla|compresa|apositos?|pad)/, /(toalla|compresa|apositos?).*(empap|cada hora|una hora)/,
  /soak\w*.*(pad|towel)/, /(pad|towel).*(soak|every hour|an hour|each hour)/,
  /coagulos?/, /\bclots?\b/,
  /fiebre|calentura|temperatura alta/, /\bfever\b/,
  /dolor (de|en el) pecho|dolor en el torax|me duele el pecho/, /chest pain|pain in my chest/,
  /(dolor de cabeza|cefalea|migrana).*(fuerte|severo|intenso|terrible)|(fuerte|severo|intenso).*dolor de cabeza/,
  /(severe|terrible|worst|bad).*headache|headache.*(severe|terrible|won t go)/,
  /falta de aire|me falta el aire|dificultad (para|al) respirar/, /short(ness)? of breath|can t breathe|trouble breathing/,
  /vision borrosa|veo borroso|desmay|me desmaye/, /blurred vision|fainted|passed out/,
  /sangrado (muy |super )?abundante|hemorragia/, /heavy bleeding|hemorrhag/,
];
const LOW_MOOD: RegExp[] = [
  /\btriste\b|tristeza|deprimid|depresion|ansiedad|ansiosa|abrumad|no puedo dormir|no duermo|llorar|lloro|sola\b|desesperad|sin ganas/,
  /\bsad\b|depress|anxious|anxiety|overwhelm|can t sleep|cannot sleep|crying|hopeless|lonely/,
  /hacerme dano|no quiero vivir|quitarme la vida|hurt myself|kill myself|don t want to live/,
];
const CRISIS = /hacerme dano|no quiero vivir|quitarme la vida|hurt myself|kill myself|don t want to live/;

export function isRedFlag(question: string): boolean {
  const n = normalize(question);
  return RED_FLAGS.some((r) => r.test(n));
}
export function isLowMood(question: string): boolean {
  const n = normalize(question);
  return LOW_MOOD.some((r) => r.test(n));
}

const SEED_KEYWORDS: Record<string, (n: string) => boolean> = {
  "qa-1": (n) => /sangrado|flujo|bleeding/.test(n) && /normal|dia 9|day 9/.test(n),
  "qa-2": (n) => /manzanilla|chamomile/.test(n),
  "qa-3": (n) => /piso pelvico|pelvic floor|kegel/.test(n),
  "qa-4": (n) => /triste|sad/.test(n) && /dormir|sleep/.test(n),
  "qa-5": (n) => /familia/.test(n) && /(pedir|pedirle|ayuda)/.test(n),
};
// English items carry `match.all_of_groups_any`: every group needs at least one term in the normalized question.
function matchesGroups(groups: string[][], n: string): boolean {
  return groups.every((g) => g.some((term) => n.includes(term)));
}
export function matchSeed(question: string, items?: SeedItem[], lang: "es" | "en" = "es"): SeedItem | null {
  const list = items ?? loadSeed(lang).items;
  const n = normalize(question);
  const exact = list.find((i) => normalize(i.question) === n);
  if (exact) return exact;
  return (
    list.find((i) => (i.match ? matchesGroups(i.match.all_of_groups_any, n) : SEED_KEYWORDS[i.id]?.(n))) ?? null
  );
}

/** Resolves to the generator's text, or null on timeout / error / empty. Never throws. */
export async function withTimeout(
  fn: () => Promise<string | null>,
  ms: number = GENERATE_TIMEOUT_MS,
): Promise<string | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), ms);
  });
  try {
    const r = await Promise.race([fn().catch(() => null), timeout]);
    return typeof r === "string" && r.trim() ? r : null;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// "posparto" must not appear on screen (REQ-2): displayed sources are rewritten.
function cleanSource(s: string): string {
  return s.replace(/posparto/gi, "después del parto").replace(/postpartum/gi, "after birth");
}

function withDisclaimer(text: string, disclaimer: string): string {
  const t = text.trim();
  // English answers (T-007) already end with the English disclaimer.
  if (t.endsWith("This is not health advice — ask your doctor or promotora.")) return t;
  return t.endsWith(disclaimer) ? t : `${t} ${disclaimer}`;
}

export async function answerQuestion(
  input: { question: string; page?: string },
  opts: { generate?: GenerateFn | null; timeoutMs?: number } = {},
): Promise<AskResult> {
  const question = (input.question ?? "").trim();
  const page = (input.page ?? "").trim();
  const lang = detectLanguage(question); // REQ-35: the language of the QUESTION, not of the UI
  const en = lang === "en";
  const g = loadGuardrails(lang);
  const D = g.disclaimer;
  const mk = (answer: string, source: string, usedSeed: boolean, kind: string): AskResult => ({
    answer: withDisclaimer(answer, D),
    source: cleanSource(source),
    usedSeed,
    lang,
    kind,
  });

  // 1. Red flag: fixed text, never reassurance, never delegated to a generator (REQ-36).
  if (isRedFlag(question)) {
    const text = en
      ? `${g.red_flag.phrase[0].toUpperCase()}${g.red_flag.phrase.slice(1)}. What you describe can be a warning sign; do not wait. If you cannot reach them, call 911.`
      : `${g.red_flag.phrase[0].toUpperCase()}${g.red_flag.phrase.slice(1)}. Lo que describes puede ser una señal de alarma; no esperes. Si no logras comunicarte, llama al 911.`;
    return mk(text, en ? "Alba, warning signs (MSD Manual / Cleveland Clinic)" : "Alba, señales de alarma (MSD Manual / Cleveland Clinic)", false, "red-flag");
  }

  // 2. Low mood: name the hotline (REQ-37). Seed qa-4 when it matches.
  if (isLowMood(question)) {
    const seed = loadSeed(lang).items.find((i) => i.id === "qa-4")!;
    const crisis = CRISIS.test(normalize(question));
    if (!crisis && matchSeed(question, undefined, lang)?.id === "qa-4") return mk(seed.answer, seed.source, true, "low-mood");
    const text = en
      ? `Feeling this way is more common than you think, and you are not alone. You can call, free, the national maternal mental health hotline ${g.low_mood.hotline}, 24/7, or ${g.low_mood.also}. You can also share it in the Circle.`
      : `No estás sola. Puedes llamar gratis y en español a la línea nacional de salud mental materna ${g.low_mood.hotline}, 24/7, o al ${g.low_mood.also}. También puedes contarlo en el Círculo.`;
    return mk(text, en ? "national maternal mental health hotline 1-833-TLC-MAMA" : "línea nacional de salud mental materna 1-833-TLC-MAMA", false, "low-mood");
  }

  const seed = matchSeed(question, undefined, lang);

  // 3. Generator (T-007 injects one). Slow/failed -> seed answer if any (AC-71).
  if (opts.generate && question) {
    const text = await withTimeout(
      () => opts.generate!({ question, page, guardrails: g }),
      opts.timeoutMs ?? GENERATE_TIMEOUT_MS,
    );
    if (text) return mk(text, en ? "Claude (unverified)" : "Claude (sin verificar)", false, "generated");
    if (seed) return mk(seed.answer, seed.source, true, "seed-fallback");
    return unsure(mk, g, en, true);
  }

  // 4. No generator: seed for the Spanish seed questions, else graceful unsure.
  if (seed) return mk(seed.answer, seed.source, true, "seed");
  return unsure(mk, g, en, false);
}

function unsure(
  mk: (a: string, s: string, u: boolean, k: string) => AskResult,
  g: GuardrailsFile,
  en: boolean,
  failed: boolean,
): AskResult {
  const text = en
    ? `I can't answer that right now. Please ${g.unsure_phrase}`
    : `No tengo esa información, ${g.unsure_phrase}`;
  return mk(text, en ? "Alba (no source for this question)" : "Alba (sin fuente para esta pregunta)", false, failed ? "error" : "unsure");
}

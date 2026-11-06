// Ask Alba -> Claude (T-007). Server-side only (the SDK import happens lazily in makeGenerate).
// Sends ONLY the typed question and the page she is on (AC-72). Never check-ins, notes or profile.
import fs from "node:fs";
import path from "node:path";
import type { GenerateFn, GenerateInput, GuardrailsFile } from "./ask-alba";

export type AskFn = (a: { system: string; messages: { role: "user" | "assistant"; content: string }[]; maxTokens?: number; timeoutMs?: number }) => Promise<string>;

type Lang = "es" | "en";
type Content = { sources: string[]; material: string };

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", file), "utf8")) as T;
  } catch {
    return null;
  }
}

function norm(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

let cached: Content | null = null;
/** Reviewed content the answers are grounded on: week 1 cards + seed Q&As, plus the known source names. */
export function loadContent(): Content {
  if (cached) return cached;
  const seed = readJson<{ items: { question: string; answer: string; source: string }[] }>("seed-qa.json");
  const week = readJson<{ cards: { title: string; body: (string | { text?: string })[]; source?: string }[] }>("week1.es.json");
  const sources = new Set<string>();
  const add = (s: string) => {
    s.split(/;| \/ /).forEach((p) => {
      const t = p.replace(/\s+—.*$/, "").trim();
      if (t.length >= 3) sources.add(t);
    });
  };
  let material = "";
  for (const c of week?.cards ?? []) {
    const lines = c.body.map((b) => (typeof b === "string" ? b : (b as { text?: string }).text ?? ""));
    material += `## ${c.title}\n${lines.join("\n")}\n`;
    for (const b of lines) {
      const m = b.match(/Fuente:\s*(.+?)\.?$/);
      if (m) add(m[1]);
    }
    if (c.source) add(c.source);
  }
  material += "\n# Preguntas y respuestas revisadas\n";
  for (const i of seed?.items ?? []) {
    add(i.source);
    material += `P: ${i.question}\nR: ${i.answer}\nFuente: ${i.source}\n\n`;
  }
  cached = { sources: [...sources], material };
  return cached;
}

export function buildSystemPrompt(g: GuardrailsFile, content: Content): string {
  return [
    "Eres Alba, una acompañante privada para las primeras semanas después del parto. Responde con calidez y claridad, en máximo 3 frases cortas (unas 60 palabras; in English, at most 3 short sentences, about 60 words).",
    `Reglas obligatorias:`,
    `- ${g.language_rule} (Answer in the language of the question.) Use only facts from the content below; if it does not cover the question, use the unsure phrase.`,
    `- ${g.cite_source} Nombra al menos una fuente. Usa estos nombres exactamente cuando apliquen: ${content.sources.join(" | ")}.`,
    `- ${g.never_diagnose}`,
    `- ${g.red_flag.rule} Si describe síntomas de alarma, di "${g.red_flag.phrase}" (en inglés: "call your doctor now") y nunca la tranquilices.`,
    `- ${g.low_mood.rule} Línea: ${g.low_mood.hotline}; ${g.low_mood.also}.`,
    `- Si no estás segura o la respuesta no está en el contenido de abajo, di: "${g.unsure_phrase}" y no inventes.`,
    `- No uses la palabra "posparto" ni "postpartum"; di "después del parto".`,
    `- No añadas el aviso legal; se agrega aparte.`,
    `Responde SOLO con JSON estricto, sin texto extra ni bloques de código: {"answer": string, "sources": [string]}.`,
    "",
    "Contenido revisado en el que debes basarte:",
    content.material,
  ].join("\n");
}

/** Defensive parse. Anything unexpected -> null (the seed fallback runs). */
export function parseReply(raw: string): { answer: string; sources: string[] } | null {
  if (typeof raw !== "string") return null;
  let t = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  t = t.slice(a, b + 1);
  try {
    const o = JSON.parse(t) as { answer?: unknown; sources?: unknown };
    if (typeof o.answer !== "string" || !o.answer.trim()) return null;
    const sources = Array.isArray(o.sources) ? o.sources.filter((s): s is string => typeof s === "string" && s.trim() !== "").map((s) => s.trim()) : [];
    return { answer: o.answer.trim(), sources };
  } catch {
    return null;
  }
}

export function isKnownSource(name: string, known: string[]): boolean {
  const n = norm(name.replace(/\s*\((sin verificar|unverified)\)\s*$/i, ""));
  if (n.length < 3) return false;
  return known.some((k) => {
    const kn = norm(k);
    return kn === n || kn.includes(n) || n.includes(kn);
  });
}

const DISCLAIMER_EN = "This is not health advice — ask your doctor or promotora.";

export function finalize(parsed: { answer: string; sources: string[] }, lang: Lang, g: GuardrailsFile, known: string[]): string {
  const flag = lang === "en" ? " (unverified)" : " (sin verificar)";
  const label = lang === "en" ? "Source" : "Fuente";
  const disclaimer = lang === "en" ? DISCLAIMER_EN : g.disclaimer;
  const names = parsed.sources.map((s) => (isKnownSource(s, known) ? s : `${s.replace(/\s*\((sin verificar|unverified)\)\s*$/i, "")}${flag}`));
  // The model sometimes writes its own source line; ours replaces it so flags are always applied.
  let text = parsed.answer.replace(/\s*(Fuentes?|Sources?)\s*:[\s\S]*$/i, "").trim();
  // The model may write its own disclaimer sentence ("This is not medical advice."): drop it so ours is the only one.
  text = text.replace(/(?:^|\s)[^.!?]*\b(?:not (?:medical|health) advice|no es (?:un )?consejo m[eé]dico)[^.!?]*[.!?]/gi, " ").replace(/\s{2,}/g, " ").trim();
  if (names.length) text += ` ${label}${names.length > 1 ? "s" : ""}: ${names.join("; ")}.`;
  else text += ` ${label}: Claude${flag}.`;
  if (!text.includes(disclaimer)) text += ` ${disclaimer}`;
  const after = lang === "en" ? "after birth" : "después del parto";
  text = text.replace(/postpartum|posparto/gi, after);
  if (lang === "en") text = text.replace(/\bmedical\b/gi, "health");
  return text;
}

function langOf(q: string): Lang {
  // same rule as ask-alba's detectLanguage, kept local to avoid a runtime import cycle
  if (/[¿¡ñáéíóúü]/i.test(q)) return "es";
  const n = norm(q);
  const en = (n.match(/\b(the|is|are|my|can|i|am|what|when|how|why|do|does|should|it|this|normal|baby|tea|feel|have|has|and|to|for|in|of|a)\b/g) ?? []).length;
  const es = (n.match(/\b(el|la|los|las|es|esta|este|mi|puedo|que|como|cuando|por|para|una|un|de|en|y|me|no|se|con|te|tengo|tomar)\b/g) ?? []).length;
  return en > es ? "en" : "es";
}

/** Testable core: inject `ask` (a fake in tests). */
export function buildGenerate(ask: AskFn, content: Content = loadContent()): GenerateFn {
  return async ({ question, page, guardrails }: GenerateInput) => {
    const system = buildSystemPrompt(guardrails, content);
    // The ONLY user data sent: the typed question and the page (AC-72).
    const user = `Página: ${page || "(ninguna)"}\nPregunta: ${question}`;
    const raw = await ask({ system, messages: [{ role: "user", content: user }], maxTokens: 700, timeoutMs: 6000 });
    const parsed = parseReply(raw);
    if (!parsed) return null;
    return finalize(parsed, langOf(question), guardrails, content.sources);
  };
}

export function makeGenerate(): GenerateFn {
  return async (input) => {
    const { askClaude } = await import("./claude");
    return buildGenerate(askClaude)(input);
  };
}

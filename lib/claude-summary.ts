// One-page summary narration (T-007, AC-78). Gets ONLY check-ins and notes: no profile, no dates of birth.
import type { NarrateData } from "./summary";
import type { AskFn } from "./claude-generate";

const SYSTEM = [
  "Redacta, en español, un párrafo breve (máximo 4 frases) que un médico pueda leer de un vistazo, a partir de los registros diarios que recibes.",
  "Escalas de 1 a 5. Describe solo lo que muestran los datos (tendencias, días con toalla empapada, notas).",
  "No diagnostiques, no des consejos ni recomendaciones, no uses la palabra posparto. No añadas nada después del párrafo.",
  "Devuelve solo el párrafo, sin título ni listas.",
].join("\n");

export function buildNarrate(ask: AskFn) {
  return async (data: NarrateData): Promise<string | null> => {
    // Only these two fields are serialised.
    const payload = JSON.stringify({ checkins: data.checkins, notes: data.notes });
    const raw = await ask({ system: SYSTEM, messages: [{ role: "user", content: payload }], maxTokens: 400, timeoutMs: 15000 });
    const t = (raw ?? "").trim().replace(/posparto/gi, "después del parto").replace(/postpartum/gi, "después del parto");
    return t || null;
  };
}

export function makeNarrate() {
  return async (data: NarrateData) => {
    const { askClaude } = await import("./claude");
    return buildNarrate(askClaude)(data);
  };
}

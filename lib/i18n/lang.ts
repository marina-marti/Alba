// Language basics. No imports, so node:test can load it (REQ-3, REQ-53).
export type Lang = "es" | "en";
export const LANGS: readonly Lang[] = ["es", "en"];
export const LANG_COOKIE = "alba_lang";

/** Spanish is the default (REQ-3); any value other than "en" falls back to Spanish. */
export function normLang(v: unknown): Lang {
  return v === "en" ? "en" : "es";
}

/** Replaces {name} placeholders. */
export function fmt(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

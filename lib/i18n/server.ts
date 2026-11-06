import "server-only";
import { cookies } from "next/headers";
import { es, type Key } from "./es";
import { en } from "./en";
import { LANG_COOKIE, fmt, normLang, type Lang } from "./lang";

export const dictionaries: Record<Lang, Record<Key, string>> = { es, en };

export async function getLang(): Promise<Lang> {
  return normLang((await cookies()).get(LANG_COOKIE)?.value);
}

export type T = (key: Key, vars?: Record<string, string | number>) => string;
export function makeT(lang: Lang): T {
  const d = dictionaries[lang];
  return (key, vars) => fmt(d[key], vars);
}

/** Server components: const { lang, t } = await getI18n(); */
export async function getI18n(): Promise<{ lang: Lang; t: T }> {
  const lang = await getLang();
  return { lang, t: makeT(lang) };
}

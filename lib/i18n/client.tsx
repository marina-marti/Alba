"use client";
import { createContext, useContext, type ReactNode } from "react";
import { fmt, type Lang } from "./lang";
import type { Key } from "./es";

type Ctx = { lang: Lang; dict: Record<Key, string> };
const I18nCtx = createContext<Ctx>({ lang: "es", dict: {} as Record<Key, string> });

export function I18nProvider({ lang, dict, children }: { lang: Lang; dict: Record<Key, string>; children: ReactNode }) {
  return <I18nCtx.Provider value={{ lang, dict }}>{children}</I18nCtx.Provider>;
}

/** Client components: const { lang, t } = useI18n(); */
export function useI18n() {
  const { lang, dict } = useContext(I18nCtx);
  return { lang, t: (key: Key, vars?: Record<string, string | number>) => fmt(dict[key] ?? key, vars) };
}

"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/lib/i18n/client";
import { LANG_COOKIE, LANGS, normLang } from "@/lib/i18n/lang";

// Session cookie (no max-age): whether the choice persists across visits is open (Q-42).
export default function LanguageSelect() {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = normLang(e.target.value);
    document.cookie = `${LANG_COOKIE}=${next}; path=/; SameSite=Lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <select
        aria-label={t("lang.label")}
        value={lang}
        onChange={change}
        disabled={pending}
        className="lang-select"
      >
        {LANGS.map((l) => (
          <option key={l} value={l}>
            {t(l === "es" ? "lang.es" : "lang.en")}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dawn-500" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

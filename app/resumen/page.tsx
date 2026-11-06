import { getProfile, listCheckins } from "@/lib/db";
import { buildSummary, summaryStats, type SummaryResult } from "@/lib/summary";
import PrintButton from "./PrintButton";
import { getI18n } from "@/lib/i18n/server";
import type { Lang } from "@/lib/i18n/lang";

export const dynamic = "force-dynamic";

const printCss = `
@page { size: A4; margin: 12mm; }
@media print {
  header, nav { display: none !important; }
  body { background: #fff !important; }
  body > div { max-width: none !important; min-height: 0 !important; display: block !important; }
  main { padding: 0 !important; }
  .no-print { display: none !important; }
  #resumen { font-size: 10pt; line-height: 1.25; color: #000; }
  #resumen h1 { font-size: 16pt; }
  #resumen table { width: 100%; border-collapse: collapse; page-break-inside: avoid; break-inside: avoid; }
  #resumen th, #resumen td { padding: 2pt 4pt; border-bottom: 0.5pt solid #999; }
  #resumen tr { page-break-inside: avoid; break-inside: avoid; }
  #resumen { page-break-after: avoid; break-after: avoid; }
}`;

const fmt = (iso: string | null, lang: Lang) => {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" });
};

export default async function Page() {
  const { lang, t } = await getI18n();
  const profile = getProfile();
  let summary: SummaryResult | null = null;
  let failed = false;
  try {
    summary = buildSummary(listCheckins(), profile); // built here from her own check-ins; nothing is sent to any service
  } catch {
    failed = true; // AC-81: error message, no table
  }
  const stats = summary ? summaryStats(summary.rows) : null;
  const num = (n: number) => n.toLocaleString(lang, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
  const metrics = stats
    ? ([["summary.colBleeding", stats.bleeding], ["summary.colPain", stats.pain], ["summary.colMood", stats.mood], ["summary.colHealing", stats.healing]] as const)
    : [];

  return (
    <div id="resumen">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <h1 className="page-title print:font-sans print:font-semibold print:tracking-normal">{t("summary.title")}</h1>
      <p className="mt-2 text-base text-ink-soft print:text-sm print:text-black">
        {t("summary.delivery")} {fmt(profile?.delivery_date ?? null, lang)} · {t("summary.appointment")} {fmt(profile?.appointment_date ?? null, lang)}
      </p>

      {failed ? (
        <p role="alert" className="mt-6 rounded-3xl bg-dawn-100 p-5">
          {t("summary.failed")}
        </p>
      ) : summary && summary.rows.length === 0 ? (
        <p className="mt-4 rounded-3xl bg-dawn-100 p-5">
          {t("summary.empty")}
        </p>
      ) : summary ? (
        <>
          {stats && (
            <section aria-labelledby="local-summary" className="mt-6 space-y-2 print:mt-3">
              <h2 id="local-summary" className="font-serif text-xl print:text-base">{t("summary.local.title")}</h2>
              <ul className="list-disc space-y-1 pl-5 text-base print:text-xs">
                <li>{t("summary.local.span", { n: stats.n, from: fmt(stats.from, lang), to: fmt(stats.to, lang) })}</li>
                {metrics.map(([k, m]) => (
                  <li key={k}>{t("summary.local.metric", { name: t(k), last: num(m.last), avg: num(m.avg), min: num(m.min), max: num(m.max) })}</li>
                ))}
                <li>{t("summary.local.pad", { n: stats.padDays })}</li>
                <li>{t("summary.local.notes", { n: stats.noteDays })}</li>
              </ul>
              <p className="text-sm text-ink-soft print:text-xs print:text-black">{t("summary.localNote")}</p>
            </section>
          )}
          <div className="mt-6 overflow-x-auto rounded-3xl bg-white/70 p-3 shadow-soft print:rounded-none print:bg-transparent print:p-0 print:shadow-none">
            <table className="w-full text-left text-sm print:text-xs [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2">
              <thead>
                <tr className="border-b border-dawn-300">
                  <th>{t("summary.colDay")}</th>
                  <th>{t("summary.colBleeding")}</th>
                  <th>{t("summary.colPain")}</th>
                  <th>{t("summary.colMood")}</th>
                  <th>{t("summary.colHealing")}</th>
                  <th>{t("summary.colPad")}</th>
                  <th>{t("summary.colNote")}</th>
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((r, i) => (
                  <tr key={i} className="border-b border-dawn-100 align-top">
                    <td className="whitespace-nowrap">{r.day}</td>
                    <td>{r.bleeding}</td>
                    <td>{r.pain}</td>
                    <td>{r.mood}</td>
                    <td>{r.healing}</td>
                    <td>{r.padSoak ? t("summary.yes") : t("summary.no")}</td>
                    <td>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-soft print:mt-2 print:text-xs print:text-black">{t("summary.footnote")}</p>
        </>
      ) : null}

      <div className="no-print mt-8">
        <PrintButton />
      </div>
    </div>
  );
}

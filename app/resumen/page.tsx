import { getProfile, listCheckins } from "@/lib/db";
import { buildSummary, type SummaryResult } from "@/lib/summary";
import { makeNarrate } from "@/lib/claude-summary";
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

function withDeadline<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

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
  let narrateFailed = false;
  try {
    const checkins = listCheckins();
    summary = await buildSummary(checkins, profile);
    if (process.env.CLAUDE_API_KEY && summary.rows.length > 0) {
      // AC-78: only check-ins and notes go to Claude. AC-81: on failure show the table + a line.
      try {
        const narrative = await withDeadline(buildSummary(checkins, profile, { narrate: makeNarrate() }), 20000);
        summary = narrative;
        if (!narrative.narrative) narrateFailed = true;
      } catch {
        narrateFailed = true;
      }
    } else if (summary.rows.length > 0) {
      narrateFailed = true;
    }
  } catch {
    failed = true; // AC-81: error message, no table
  }

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
          {summary.narrative && <p className="mt-6 text-base print:mt-3 print:text-sm">{summary.narrative}</p>}
          {narrateFailed && !summary.narrative && (
            <p role="alert" className="no-print mt-6 rounded-3xl bg-dawn-100 p-5">
              {t("summary.narrateFailed")}
            </p>
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

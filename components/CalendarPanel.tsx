import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { listCheckins, listExerciseDays } from "@/lib/db";
import { buildMonth, dayDetail, isoLocal, lastDays, parseDay, parseMonth, type CalDay } from "@/lib/calendar";
import CalendarSparkline from "@/components/CalendarSparkline";
import CalendarMonth from "@/components/CalendarMonth";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Right-hand column of the dashboard: today strip, month grid, day detail, 14-day patterns (REQ-57).
 *  Shows her own numbers only: no score, trend label or advice (OOS-1, Q-47). */
export default async function CalendarPanel({ mes, dia }: { mes?: string | string[]; dia?: string | string[] }) {
  const { lang, t } = await getI18n();
  const locale = lang === "en" ? "en-US" : "es-ES";
  const now = new Date();
  const todayIso = isoLocal(now);
  const checkins = listCheckins();
  const exDays = listExerciseDays();

  const { year, month } = parseMonth(mes, now);
  const grid = buildMonth(year, month, checkins, exDays);
  const selected = parseDay(dia);
  const today = dayDetail(todayIso, checkins, exDays);
  const strip = lastDays(14, now, checkins);


  const chips = (r: NonNullable<CalDay["ratings"]>) =>
    [
      ["cal.bleeding", r.bleeding],
      ["cal.pain", r.pain],
      ["cal.mood", r.mood],
      ["cal.healing", r.healing],
    ] as const;

  const seq = (field: "mood" | "pain") => strip.map((d) => d[field] ?? t("cal.chartNone")).join(", ");

  return (
    <div id="calendario" className="space-y-6 scroll-mt-4">
      {/* today strip */}
      <section className="card space-y-3 !p-5" aria-labelledby="cal-today">
        <h2 id="cal-today" className="font-serif text-xl text-ink">
          {t("cal.todayTitle")}
        </h2>
        {today.ratings ? (
          <ul className="flex flex-wrap gap-2">
            {chips(today.ratings).map(([k, v]) => (
              <li key={k} className="rounded-full bg-dawn-100 px-3 py-1 text-sm">
                {t(k)} <span className="font-semibold">{v}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p>{t("cal.noCheckin")}</p>
            <Link href="/checkin" className="btn !min-h-11 !px-5 !py-2 text-sm">
              {t("cal.doCheckin")}
            </Link>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="flex items-center gap-2">
            <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${today.exercised ? "bg-sage-600" : "border border-sage-600"}`} />
            {today.exercised ? t("cal.exDone") : t("cal.exPending")}
          </p>
          <Link href="/entrenamiento" className="link inline-flex min-h-11 items-center text-sm">
            {t("cal.exLink")}
          </Link>
        </div>
      </section>

      {/* month: client component, so picking a day or month never navigates or scrolls */}
      <CalendarMonth
        locale={locale}
        todayIso={todayIso}
        initialMonth={grid.key}
        initialDay={selected ?? todayIso}
        checkins={checkins}
        exDays={Array.from(exDays)}
        labels={{
          title: t("cal.title"), prev: t("cal.prev"), next: t("cal.next"),
          legendCheckin: t("cal.legendCheckin"), legendExercise: t("cal.legendExercise"), legendTint: t("cal.legendTint"),
          soak: t("cal.soak"), yes: t("cal.yes"), no: t("cal.no"), note: t("cal.note"), noNote: t("cal.noNote"), noEntry: t("cal.noEntry"),
          exYes: t("cal.exYes"), exNo: t("cal.exNo"),
          bleeding: t("cal.bleeding"), pain: t("cal.pain"), mood: t("cal.mood"), healing: t("cal.healing"),
        }}
      />

      {/* patterns */}
      <section className="card space-y-3 !p-5" aria-labelledby="cal-patterns">
        <h2 id="cal-patterns" className="font-serif text-xl text-ink">
          {t("cal.patterns")}
        </h2>
        <p className="text-sm text-ink-soft">{t("cal.patternsNote")}</p>
        <CalendarSparkline label={t("cal.chartMood")} days={strip} field="mood" color="#e9ab7e" alt={t("cal.chartAlt", { what: t("cal.chartMood"), values: seq("mood") })} />
        <CalendarSparkline label={t("cal.chartPain")} days={strip} field="pain" color="#7f9e79" alt={t("cal.chartAlt", { what: t("cal.chartPain"), values: seq("pain") })} />
      </section>
    </div>
  );
}

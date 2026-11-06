import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";
import { listCheckins, listExerciseDays } from "@/lib/db";
import { buildMonth, dayDetail, isoLocal, lastDays, parseDay, parseMonth, type CalDay } from "@/lib/calendar";
import CalendarSparkline from "@/components/CalendarSparkline";

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
  const detail = selected ? dayDetail(selected, checkins, exDays) : null;
  const today = dayDetail(todayIso, checkins, exDays);
  const strip = lastDays(14, now, checkins);

  const monthName = cap(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1))));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i)))); // 2024-01-01 is a Monday
  const dateLabel = (iso: string) => cap(new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`)));
  const href = (m: string, d?: string) => `/?mes=${m}${d ? `&dia=${d}` : ""}#calendario`;

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

      {/* month */}
      <section className="card !p-5" aria-labelledby="cal-title">
        <h2 id="cal-title" className="font-serif text-2xl text-ink">
          {t("cal.title")}
        </h2>
        <div className="mt-2 flex items-center justify-between">
          <Link href={href(grid.prev)} aria-label={t("cal.prev")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-xl shadow-soft">
            <span aria-hidden>‹</span>
          </Link>
          <p className="text-lg font-medium" aria-live="polite">
            {monthName}
          </p>
          <Link href={href(grid.next)} aria-label={t("cal.next")} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-xl shadow-soft">
            <span aria-hidden>›</span>
          </Link>
        </div>

        <div role="grid" aria-label={t("cal.grid", { month: monthName })} className="mt-3 grid grid-cols-7 gap-1.5">
          {weekdays.map((w, i) => (
            <div key={i} aria-hidden className="py-1 text-center text-xs uppercase text-ink-soft">
              {w}
            </div>
          ))}
          {grid.weeks.flat().map((c, i) => {
            if (!c) return <div key={`b${i}`} aria-hidden />;
            const n = Number(c.date.slice(8));
            const isToday = c.date === todayIso;
            const isSel = c.date === selected;
            const tint = c.ratings ? `rgba(241, 195, 157, ${(0.16 + (c.ratings.mood - 1) * 0.14).toFixed(2)})` : "rgba(255,255,255,0.6)";
            const label = [dateLabel(c.date), c.checkedIn ? t("cal.legendCheckin") : "", c.exercised ? t("cal.legendExercise") : ""].filter(Boolean).join(", ");
            return (
              <Link
                key={c.date}
                href={href(grid.key, c.date)}
                aria-label={label}
                aria-current={isToday ? "date" : undefined}
                style={{ backgroundColor: tint }}
                className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl py-1 text-sm ${isToday ? "ring-2 ring-dawn-400/70" : ""} ${isSel ? "outline outline-2 outline-offset-1 outline-sage-600/60" : ""}`}
              >
                <span>{n}</span>
                <span aria-hidden className="flex h-2 items-center gap-1">
                  {c.checkedIn && <span className="h-1.5 w-1.5 rounded-full bg-dawn-500" />}
                  {c.exercised && <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />}
                </span>
              </Link>
            );
          })}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full bg-dawn-500" />
            {t("cal.legendCheckin")}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full bg-sage-600" />
            {t("cal.legendExercise")}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-6 rounded-full" style={{ background: "linear-gradient(90deg, rgba(241,195,157,0.2), rgba(241,195,157,0.75))" }} />
            {t("cal.legendTint")}
          </li>
        </ul>

        {detail && (
          <div className="mt-4 space-y-3 rounded-3xl bg-dawn-50/80 p-4" aria-live="polite">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{dateLabel(detail.date)}</h3>
              <Link href={href(grid.key)} className="link inline-flex min-h-11 items-center text-sm">
                {t("cal.close")}
              </Link>
            </div>
            {detail.ratings ? (
              <>
                <ul className="flex flex-wrap gap-2">
                  {chips(detail.ratings).map(([k, v]) => (
                    <li key={k} className="rounded-full bg-white/80 px-3 py-1 text-sm">
                      {t(k)} <span className="font-semibold">{v}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm">
                  {t("cal.soak")} <span className="font-semibold">{detail.padSoak ? t("cal.yes") : t("cal.no")}</span>
                </p>
                <p className="text-sm">
                  <span className="text-ink-soft">{t("cal.note")}: </span>
                  {detail.note ? detail.note : t("cal.noNote")}
                </p>
              </>
            ) : (
              <p className="text-sm">{t("cal.noEntry")}</p>
            )}
            <p className="text-sm">{detail.exercised ? t("cal.exYes") : t("cal.exNo")}</p>
          </div>
        )}
      </section>

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

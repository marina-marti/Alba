"use client";
import { useState } from "react";
import { buildMonth, dayDetail, type CalDay, type CheckinRow } from "@/lib/calendar";

export type CalendarLabels = {
  title: string; prev: string; next: string;
  legendCheckin: string; legendExercise: string; legendTint: string;
  soak: string; yes: string; no: string; note: string; noNote: string; noEntry: string; exYes: string; exNo: string;
  bleeding: string; pain: string; mood: string; healing: string;
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Month grid and day detail. Picking a day or a month only changes state: no navigation, so the page never jumps. */
export default function CalendarMonth(props: {
  locale: string; todayIso: string; initialMonth: string; initialDay: string;
  checkins: CheckinRow[]; exDays: string[]; labels: CalendarLabels;
}) {
  const { locale, todayIso, checkins, exDays, labels: L } = props;
  const [monthKey, setMonthKey] = useState(props.initialMonth);
  const [selected, setSelected] = useState(props.initialDay);
  const [year, month] = monthKey.split("-").map(Number);
  const grid = buildMonth(year, month, checkins, exDays);
  const detail = dayDetail(selected, checkins, exDays);

  const monthName = cap(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1))));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i)))); // 2024-01-01 is a Monday
  const dateLabel = (iso: string) => cap(new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`)));
  const chips = (r: NonNullable<CalDay["ratings"]>) => [[L.bleeding, r.bleeding], [L.pain, r.pain], [L.mood, r.mood], [L.healing, r.healing]] as const;

  return (
    <section className="card !p-5" aria-labelledby="cal-title">
      <h2 id="cal-title" className="font-serif text-2xl text-ink">{L.title}</h2>
      <div className="mt-2 flex items-center justify-between">
        <button type="button" onClick={() => setMonthKey(grid.prev)} aria-label={L.prev} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-xl shadow-soft transition-transform active:scale-95">
          <span aria-hidden>‹</span>
        </button>
        <p className="text-lg font-medium" aria-live="polite">{monthName}</p>
        <button type="button" onClick={() => setMonthKey(grid.next)} aria-label={L.next} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-xl shadow-soft transition-transform active:scale-95">
          <span aria-hidden>›</span>
        </button>
      </div>

      <div role="grid" aria-label={monthName} className="mt-3 grid grid-cols-7 gap-1.5">
        {weekdays.map((w, i) => (
          <div key={i} aria-hidden className="py-1 text-center text-xs uppercase text-ink-soft">{w}</div>
        ))}
        {grid.weeks.flat().map((c, i) => {
          if (!c) return <div key={`b${i}`} aria-hidden />;
          const n = Number(c.date.slice(8));
          const isToday = c.date === todayIso;
          const isSel = c.date === selected;
          const tint = c.ratings ? `rgba(241, 195, 157, ${(0.16 + (c.ratings.mood - 1) * 0.14).toFixed(2)})` : "rgba(255,255,255,0.6)";
          const label = [dateLabel(c.date), c.checkedIn ? L.legendCheckin : "", c.exercised ? L.legendExercise : ""].filter(Boolean).join(", ");
          return (
            <button
              type="button"
              key={c.date}
              onClick={() => setSelected(c.date)}
              aria-label={label}
              aria-pressed={isSel}
              aria-current={isToday ? "date" : undefined}
              style={{ backgroundColor: tint }}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-2xl py-1 text-sm tabular-nums transition-[box-shadow,transform] duration-200 active:scale-95 ${isToday ? "ring-2 ring-dawn-400/70" : ""} ${isSel ? "outline outline-2 outline-offset-1 outline-sage-600/60" : ""}`}
            >
              <span>{n}</span>
              <span aria-hidden className="flex h-2 items-center gap-1">
                {c.checkedIn && <span className="h-1.5 w-1.5 rounded-full bg-dawn-500" />}
                {c.exercised && <span className="h-1.5 w-1.5 rounded-full bg-sage-600" />}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <li className="flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-dawn-500" />{L.legendCheckin}</li>
        <li className="flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-sage-600" />{L.legendExercise}</li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-6 rounded-full" style={{ background: "linear-gradient(90deg, rgba(241,195,157,0.2), rgba(241,195,157,0.75))" }} />
          {L.legendTint}
        </li>
      </ul>

      {/* Always shown, with a fixed minimum height, so choosing a day never moves the page. */}
      <div className="mt-4 min-h-[15rem] space-y-3 rounded-3xl bg-dawn-50/80 p-4" aria-live="polite">
        <h3 className="font-semibold">{dateLabel(detail.date)}</h3>
        {detail.ratings ? (
          <>
            <ul className="flex flex-wrap gap-2">
              {chips(detail.ratings).map(([k, v]) => (
                <li key={k} className="rounded-full bg-white/80 px-3 py-1 text-sm">{k} <span className="font-semibold">{v}</span></li>
              ))}
            </ul>
            <p className="text-sm">{L.soak} <span className="font-semibold">{detail.padSoak ? L.yes : L.no}</span></p>
            <p className="text-sm"><span className="text-ink-soft">{L.note}: </span>{detail.note ? detail.note : L.noNote}</p>
          </>
        ) : (
          <p className="text-sm">{L.noEntry}</p>
        )}
        <p className="text-sm">{detail.exercised ? L.exYes : L.exNo}</p>
      </div>
    </section>
  );
}

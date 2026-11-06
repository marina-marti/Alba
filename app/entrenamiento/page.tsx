import Link from "next/link";
import { currentWeek, workoutFor } from "@/lib/workouts";
import { refreshWorkoutAction, toggleExerciseTodayAction } from "./actions";
import { listExerciseDays } from "@/lib/db";
import { isoLocal } from "@/lib/calendar";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// All UI strings live here so the language-selector work can adopt them.
const COPY = {
  es: {
    title: "Movimiento suave",
    week: (n: number) => `Semana ${n}`,
    rest: "Descanso de cuarentena: despacio, poco y con calma.",
    steps: "Tu rutina",
    sources: "Fuentes",
    refresh: "Preparar otra rutina",
    error: "No pudimos preparar tu rutina ahora. Inténtalo de nuevo.",
    retry: "Intentar de nuevo",
    signup: "Añade la fecha del parto para ver la rutina de tu semana. Mientras tanto, esta es la de la semana 1.",
    signupLink: "Ir a mi perfil",
  },
  en: {
    title: "Gentle movement",
    week: (n: number) => `Week ${n}`,
    rest: "Cuarentena rest: slow, small and calm.",
    steps: "Your routine",
    sources: "Sources",
    refresh: "Prepare another routine",
    error: "We couldn't prepare your routine right now. Please try again.",
    retry: "Try again",
    signup: "Add your delivery date to see the routine for your week. For now, this is week 1.",
    signupLink: "Go to my profile",
  },
} as const;

export default async function Page() {
  const { lang, t: t2 } = await getI18n();
  const t = COPY[lang];
  const { week, needsProfile } = currentWeek();
  const r = await workoutFor(week, lang);
  const doneToday = listExerciseDays().includes(isoLocal(new Date()));

  return (
    <div className="space-y-8">
      <h1 className="page-title">{t.title}</h1>
      <p className="text-lg">{t.week(week)}</p>
      <p>{t.rest}</p>
      {needsProfile && (
        <div className="card space-y-3">
          <p>{t.signup}</p>
          <Link href="/perfil" className="btn btn-quiet">
            {t.signupLink}
          </Link>
        </div>
      )}
      <form action={toggleExerciseTodayAction} className="space-y-1">
        <button type="submit" aria-pressed={doneToday} className={`btn ${doneToday ? "btn-sage" : "btn-quiet"}`}>
          {doneToday ? t2("cal.undo") : t2("cal.done")}
        </button>
        {!doneToday && <p className="text-sm text-ink-soft">{t2("cal.doneHint")}</p>}
      </form>
      {r.ok ? (
        <>
          <section className="card space-y-4" aria-label={t.steps}>
            <h2 className="text-xl font-semibold">{r.routine.title}</h2>
            <p>{r.routine.intro}</p>
            <ol className="list-decimal space-y-2 pl-6">
              {r.routine.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </section>
          <section className="space-y-2">
            <h2 className="font-semibold">{t.sources}</h2>
            <ul className="list-disc space-y-1 pl-6 text-sm">
              {r.routine.sources.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
          <p className="text-sm">{r.routine.disclaimer}</p>
          <form action={refreshWorkoutAction}>
            <input type="hidden" name="lang" value={lang} />
            <button type="submit" className="btn btn-quiet">
              {t.refresh}
            </button>
          </form>
        </>
      ) : (
        <div className="card space-y-3" role="alert">
          <p>{t.error}</p>
          <Link href={lang === "en" ? "/entrenamiento?lang=en" : "/entrenamiento"} className="btn btn-quiet">
            {t.retry}
          </Link>
        </div>
      )}
    </div>
  );
}

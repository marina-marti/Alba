import Link from "next/link";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { getProfile } from "@/lib/db";
import { daysSince, longDate, weekLine, type Lang } from "@/lib/today";
import flagsEs from "@/content/redflags.es.json";
import flagsEn from "@/content/redflags.en.json";
import Card from "@/components/Card";
import CalendarPanel from "@/components/CalendarPanel";

export const dynamic = "force-dynamic";

const COPY = {
  es: {
    today: "Hoy",
    noDate: "Cuéntanos cuándo nació tu bebé para ver en qué semana vas.",
    addDate: "Añadir la fecha del parto",
    watchTitle: "Llama hoy si notas",
    watchAction: "Si notas alguna, llama a tu médico ahora.",
    seeAll: "Ver todas",
    optionsTitle: "¿Qué quieres hacer?",
    options: {
      checkin: ["Check-in diario", "¿Cómo estás hoy?"],
      ask: ["Pregúntale a Alba", "Tus dudas, con calma"],
      cards: ["Tarjetas de la semana", "Lo esencial, en corto"],
      circle: ["El Círculo", "Otras mamás"],
      summary: ["Mi resumen", "Para tu cita"],
      visit: ["Mi cita", "Prepárala aquí"],
      exercise: ["Ejercicios", "Movimiento suave"],
      reminders: ["Recordatorios", "Te avisamos"],
      flags: ["Banderas rojas", "Cuándo llamar al médico"],
    },
  },
  en: {
    today: "Today",
    noDate: "Tell us when your baby was born to see which week you are in.",
    addDate: "Add your delivery date",
    watchTitle: "Call today if you notice",
    watchAction: "If you notice any of these, call your doctor now.",
    seeAll: "See all",
    optionsTitle: "What would you like to do?",
    options: {
      checkin: ["Daily check-in", "How are you today?"],
      ask: ["Ask Alba", "Your questions, calmly"],
      cards: ["This week's cards", "The essentials, short"],
      circle: ["The Circle", "Other moms"],
      summary: ["My summary", "For your visit"],
      visit: ["My visit", "Get ready here"],
      exercise: ["Exercises", "Gentle movement"],
      reminders: ["Reminders", "We'll nudge you"],
      flags: ["Red flags", "When to call your doctor"],
    },
  },
} as const;

async function getLang(): Promise<Lang> {
  return (await cookies()).get("alba_lang")?.value === "en" ? "en" : "es";
}

// Same sourced red flags as /banderas (not week-specific). Self-harm item shortened like /banderas does (Q-15).
const TOP_FLAGS = ["rf-1", "rf-3", "rf-5", "rf-7"];
const short = (id: string, text: string) => (id === "rf-7" ? text.split(/\s[—-]\s/)[0].replace(/\.$/, "") + "." : text);

const icon = (children: ReactNode) => (
  <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const ICONS = {
  checkin: icon(<><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" /></>),
  ask: icon(<><path d="M5 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8l-4 3.5V16H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /><path d="M9 10h6" /></>),
  cards: icon(<><rect x="4" y="7" width="13" height="13" rx="3" /><path d="M8 4h10a2 2 0 0 1 2 2v10" /></>),
  circle: icon(<><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /></>),
  summary: icon(<><path d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M9 12h6M9 16h4" /></>),
  visit: icon(<><rect x="4" y="5" width="16" height="15" rx="3" /><path d="M8 3v4M16 3v4M4 10h16" /></>),
  exercise: icon(<><circle cx="12" cy="5" r="2" /><path d="M12 8v6M6 10l6-2 6 2M9 21l3-7 3 7" /></>),
  reminders: icon(<><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15z" /><path d="M10 21h4" /></>),
  flags: icon(<><path d="M6 21V4" /><path d="M6 5h11l-2 4 2 4H6" /></>),
};

type Key = keyof typeof ICONS;
const PRIMARY: { key: Key; href: string }[] = [
  { key: "checkin", href: "/checkin" },
  { key: "ask", href: "/pregunta" },
];
const SECONDARY: { key: Key; href: string }[] = [
  { key: "cards", href: "/semana-1" },
  { key: "circle", href: "/circulo" },
  { key: "summary", href: "/resumen" },
  { key: "visit", href: "/visita" },
  { key: "exercise", href: "/entrenamiento" },
  { key: "reminders", href: "/recordatorios" },
  { key: "flags", href: "/banderas" },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ mes?: string | string[]; dia?: string | string[] }> }) {
  const { mes, dia } = await searchParams;
  const lang = await getLang();
  const t = COPY[lang];
  const flags = lang === "en" ? flagsEn : flagsEs;
  const now = new Date();
  const profile = getProfile();
  const days = daysSince(profile?.delivery_date, now);
  const items = flags.items.filter((i) => TOP_FLAGS.includes(i.id));

  return (
    // Home only: widen past the narrow column on large screens (two columns, calendar on the right).
    <div className="space-y-10 lg:relative lg:left-1/2 lg:grid lg:w-[min(72rem,calc(100vw-4rem))] lg:-translate-x-1/2 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10 lg:gap-y-10 lg:space-y-0">
      <div className="space-y-10 lg:col-start-1 lg:row-start-1">
      {/* today circle */}
      <section className="relative mx-auto flex aspect-square w-full max-w-[22rem] flex-col items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-white/90 to-dawn-100/70 px-12 text-center shadow-soft">
        <p className="relative text-sm uppercase tracking-widest text-ink-soft">{t.today}</p>
        <h1 className="page-title relative mt-2 text-balance">{longDate(now, lang)}</h1>
        {days !== null ? (
          <p className="relative mt-4 text-balance text-lg text-dawn-600">{weekLine(days, lang)}</p>
        ) : (
          <>
            <p className="relative mt-3 text-balance text-base text-ink-soft">{t.noDate}</p>
            <Link href="/perfil" className="btn relative mt-4 !px-6 !py-2 text-sm">
              {t.addDate}
            </Link>
          </>
        )}
      </section>

      {/* red flags */}
      <Card>
        <h2 className="font-serif text-2xl text-ink">{t.watchTitle}</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex gap-3 text-ink">
              <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-dawn-500" />
              <span>{short(i.id, i.text)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-medium text-ink">{t.watchAction}</p>
        <Link href="/banderas" className="link mt-3 inline-flex min-h-11 items-center">
          {t.seeAll}
        </Link>
      </Card>

      </div>

      {/* calendar: below the cards on mobile, the right column (sticky, full height) on wide screens */}
      <div className="lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:p-1 lg:pb-6">
        <CalendarPanel mes={mes} dia={dia} />
      </div>

      {/* options */}
      <section aria-labelledby="options-title" className="space-y-4 lg:col-start-1 lg:row-start-2">
        <h2 id="options-title" className="px-1 font-serif text-2xl text-ink">
          {t.optionsTitle}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PRIMARY.map(({ key, href }) => (
            <Link key={key} href={href} className="btn min-h-[8rem] flex-col !items-start !justify-start gap-2 !rounded-4xl !px-5 !py-5 text-left">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-dawn-600">{ICONS[key]}</span>
              <span className="text-lg font-semibold leading-tight">{t.options[key][0]}</span>
              <span className="text-sm leading-snug text-ink-soft">{t.options[key][1]}</span>
            </Link>
          ))}
          {SECONDARY.map(({ key, href }, n) => (
            <Link
              key={key}
              href={href}
              className={`btn btn-quiet min-h-[6.5rem] flex-col !items-start !justify-start gap-1 !rounded-4xl !px-5 !py-4 text-left ${
                n === SECONDARY.length - 1 ? "col-span-2" : ""
              }`}
            >
              <span className="text-dawn-500">{ICONS[key]}</span>
              <span className="font-semibold leading-tight">{t.options[key][0]}</span>
              <span className="text-sm leading-snug text-ink-soft">{t.options[key][1]}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";
// Illustrated demo map (REQ-58, OOS-2). Purely simulated: never calls navigator.geolocation,
// makes no network request, and keeps the same four invented clinics.
import { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { useI18n } from "@/lib/i18n/client";
import { YOU_EXAMPLE, YOU_START, rankByDistance, simulateLocation, telHref, type Clinic } from "@/lib/clinics";

export default function ClinicMap({ clinics, initialRank }: { clinics: Clinic[]; initialRank: number | null }) {
  const { t } = useI18n();
  const [ranked, setRanked] = useState<Clinic[]>(() => rankByDistance(clinics));
  const [selected, setSelected] = useState<string | null>(() => (initialRank ? rankByDistance(clinics)[initialRank - 1].id : null));
  const [example, setExample] = useState(false);
  const [settling, setSettling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const you = example ? YOU_EXAMPLE : YOU_START;
  const current = ranked.find((c) => c.id === selected) ?? null;

  // Simulated "use my location": the dot drifts, the list fades, re-ranks and settles. Nothing is read or sent.
  function useExample() {
    if (example || settling) return;
    setExample(true);
    setSettling(true);
    timer.current = setTimeout(() => {
      setRanked(simulateLocation(clinics));
      setSettling(false);
    }, 450);
  }
  const toggle = (id: string) => setSelected((s) => (s === id ? null : id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="sage" onClick={useExample} disabled={example}>
          <PinIcon /> {t("clinics.useLocation")}
        </Button>
        <p aria-live="polite" className={`rounded-full bg-white/80 px-4 py-2 text-sm text-sage-700 transition-opacity duration-500 ${example ? "opacity-100" : "opacity-0"}`}>
          {example ? t("clinics.exampleLocation") : ""}
        </p>
      </div>

      <div role="group" aria-label={t("clinics.mapLabel")} className="relative aspect-[4/3] w-full overflow-hidden rounded-4xl bg-sage-50 shadow-soft">
        <MapArt />
        <div aria-hidden className="clinic-you" style={{ left: `${you.x}%`, top: `${you.y}%` }}>
          <span className="clinic-you-ring" />
          <span className="clinic-you-dot" />
          <span className="clinic-you-label">{t("clinics.you")}</span>
        </div>
        {ranked.map((c, i) => {
          const on = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              aria-label={t("clinics.pin", { n: i + 1, name: c.name, km: c.distance_km.toFixed(1) })}
              onClick={() => toggle(c.id)}
              className="clinic-pin"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span className={`clinic-pin-body ${on ? "is-on" : ""}`}>{i + 1}</span>
            </button>
          );
        })}
      </div>

      {current ? (
        <Card className="space-y-3 !bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl leading-snug text-ink">{current.name}</h2>
              <p className="text-sm text-ink-soft">{current.type} · {t("clinics.km", { km: current.distance_km.toFixed(1) })}</p>
            </div>
            <button type="button" onClick={() => setSelected(null)} aria-label={t("clinics.close")} className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-ink-soft hover:bg-dawn-100">
              <span aria-hidden>×</span>
            </button>
          </div>
          <p className="text-base"><span className="text-ink-soft">{t("clinics.hours")}:</span> {current.hours}</p>
          <div className="flex flex-wrap gap-3">
            <a href={telHref(current.phone)} className="btn">{t("clinics.call", { phone: current.phone })}</a>
            {/* Simulated: inert on purpose, there is no routing in the demo. */}
            <Button type="button" variant="quiet" onClick={() => {}}>{t("clinics.directions")}</Button>
          </div>
        </Card>
      ) : (
        <p className="px-1 text-base text-ink-soft">{t("clinics.hint")}</p>
      )}

      <section aria-labelledby="clinics-list">
        <h2 id="clinics-list" className="mb-3 font-serif text-xl text-ink">{t("clinics.listTitle")}</h2>
        <ol className={`space-y-3 transition-opacity duration-500 ease-out ${settling ? "opacity-30" : "opacity-100"}`}>
          {ranked.map((c, i) => {
            const on = c.id === selected;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(c.id)}
                  className={`flex min-h-16 w-full items-center gap-4 rounded-3xl px-4 py-3 text-left shadow-soft transition-[background-color,box-shadow,transform] duration-300 ease-out ${on ? "bg-dawn-200 ring-2 ring-dawn-400" : "bg-white/80 hover:bg-white"}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg transition-colors duration-300 ${on ? "bg-dawn-400 text-ink" : "bg-sage-100 text-sage-700"}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-snug text-ink">{c.name}</span>
                    <span className="block text-sm text-ink-soft">{c.type}</span>
                  </span>
                  <span className="shrink-0 text-sm text-ink-soft">{t("clinics.km", { km: c.distance_km.toFixed(1) })}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** Soft illustrated map: parks, a river, roads. Inline SVG only. */
function MapArt() {
  return (
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <rect width="400" height="300" fill="#f6f1e4" />
      <g fill="#dfe9d8">
        <path d="M-10 -10h150c10 30-6 52-30 60-28 10-60 0-80 26C10 100-10 90-10 70z" />
        <path d="M250 205c30-14 70-8 100 6 24 12 54 4 70 -10v110H230c-14-30-8-82 20-106z" />
        <path d="M150 140c18-10 44-8 54 8s0 38-20 44-46 0-48-24c-1-12 4-22 14-28z" fill="#e6eee2" />
      </g>
      <path d="M-10 150C40 120 80 160 130 138s70-62 126-70 100 10 160-34" fill="none" stroke="#cfe3de" strokeWidth="26" strokeLinecap="round" />
      <path d="M-10 150C40 120 80 160 130 138s70-62 126-70 100 10 160-34" fill="none" stroke="#e1eeea" strokeWidth="14" strokeLinecap="round" />
      <g fill="none" strokeLinecap="round">
        <g stroke="#ecdcc4" strokeWidth="11">
          <path d="M-10 250C70 230 130 240 200 214s120-30 220-8" />
          <path d="M96 -10C110 60 90 120 120 190s10 80 30 130" />
          <path d="M300 -10C290 50 320 110 310 170s-30 90-20 140" />
        </g>
        <g stroke="#fffaf0" strokeWidth="7">
          <path d="M-10 250C70 230 130 240 200 214s120-30 220-8" />
          <path d="M96 -10C110 60 90 120 120 190s10 80 30 130" />
          <path d="M300 -10C290 50 320 110 310 170s-30 90-20 140" />
        </g>
        <g stroke="#fffaf0" strokeWidth="4" opacity="0.9">
          <path d="M-10 90C60 70 110 96 170 80s120-30 230-10" />
          <path d="M180 -10C190 40 170 80 190 130s30 70 20 140" />
        </g>
      </g>
      <g fill="#efe3cd" opacity="0.7">
        <rect x="220" y="110" width="30" height="20" rx="6" />
        <rect x="330" y="120" width="34" height="22" rx="6" />
        <rect x="40" y="200" width="30" height="20" rx="6" />
        <rect x="320" y="240" width="28" height="18" rx="6" />
      </g>
    </svg>
  );
}

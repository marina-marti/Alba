"use client";
// Illustrated demo map (REQ-58, OOS-2). Purely simulated: never calls navigator.geolocation,
// makes no network request. All places are invented, around one fictional town.
import { useEffect, useRef, useState } from "react";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { useI18n } from "@/lib/i18n/client";
import { CLINIC_KINDS, YOU_EXAMPLE, YOU_START, rankByDistance, simulateLocation, telHref, type Clinic, type ClinicKind, type Town } from "@/lib/clinics";

export default function ClinicMap({ clinics, town, initialRank }: { clinics: Clinic[]; town: Town; initialRank: number | null }) {
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
        <div role="img" aria-label={t("clinics.you", { town: town.name })} className="clinic-you" style={{ left: `${you.x}%`, top: `${you.y}%` }}>
          <span className="clinic-you-ring" />
          <span className="clinic-you-dot" />
          <span className="clinic-you-label">{town.name}</span>
        </div>
        {ranked.map((c, i) => {
          const on = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              aria-label={t("clinics.pin", { kind: t(`clinics.kind.${c.kind}`), n: i + 1, name: c.name, km: c.distance_km.toFixed(1) }) + ", " + t(`clinics.cost.${c.cost}`)}
              onClick={() => toggle(c.id)}
              className="clinic-pin"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span className={`clinic-pin-body kind-${c.kind} ${on ? "is-on" : ""}`}>{i + 1}<span className="clinic-pin-badge"><KindIcon kind={c.kind} /></span></span>
            </button>
          );
        })}
      </div>

      <ul aria-label={t("clinics.legend")} className="flex flex-wrap gap-x-5 gap-y-2 px-1 text-sm text-ink-soft">
        {CLINIC_KINDS.map((k) => (
          <li key={k} className={`kind-${k} flex items-center gap-2`}>
            <span className="clinic-pin-badge !static !h-5 !w-5"><KindIcon kind={k} /></span>
            {t(`clinics.legend.${k}`)}
          </li>
        ))}
      </ul>

      {current ? (
        <Card className="space-y-3 !bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl leading-snug text-ink">{current.name}</h2>
              <p className="text-sm text-ink-soft">{current.type} · {t("clinics.km", { km: current.distance_km.toFixed(1) })}</p>
              <div className="mt-2"><CostBadge cost={current.cost} label={t(`clinics.cost.${current.cost}`)} /></div>
            </div>
            <button type="button" onClick={() => setSelected(null)} aria-label={t("clinics.close")} className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl text-ink-soft hover:bg-dawn-100">
              <span aria-hidden>×</span>
            </button>
          </div>
          <p className="text-base"><span className="text-ink-soft">{t("clinics.getting")}:</span> {current.getting_there}</p>
          <p className="text-base"><span className="text-ink-soft">{t("clinics.hours")}:</span> {current.hours}</p>
          <p className="text-base"><span className="text-ink-soft">{t("clinics.services")}:</span> {current.services}</p>
          <div className="flex flex-wrap gap-3">
            <a href={telHref(current.phone)} className="btn">{t("clinics.call", { phone: current.phone })}</a>
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
                  className={`flex min-h-16 w-full items-center gap-3 rounded-3xl px-4 py-3 text-left shadow-soft transition-[background-color,box-shadow,transform] duration-300 ease-out ${on ? "bg-dawn-200 ring-2 ring-dawn-400" : "bg-white/80 hover:bg-white"}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg transition-colors duration-300 ${on ? "bg-dawn-400 text-ink" : "bg-sage-100 text-sage-700"}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-snug text-ink">{c.name}</span>
                    <span className="block text-sm text-ink-soft">{c.type}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-2">
                      <CostBadge cost={c.cost} label={t(`clinics.cost.${c.cost}`)} />
                    </span>
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

/** Soft illustrated rural map: fields, hills, a winding river, a dirt road, a main road, a small town with a church. Inline SVG only. */
function MapArt() {
  const house = (x: number, y: number, w = 12, h = 8, roof = "#e9b99a") => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill="#fffaf0" />
      <path d={`M${x - 1.5} ${y + 1} L${x + w / 2} ${y - 5} L${x + w + 1.5} ${y + 1}z`} fill={roof} />
    </g>
  );
  const tree = (x: number, y: number, r = 5) => (
    <g key={`t${x}-${y}`}>
      <rect x={x - 0.8} y={y} width="1.6" height={r * 0.9} fill="#b9a58a" />
      <circle cx={x} cy={y} r={r} fill="#a9c4a0" />
    </g>
  );
  return (
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <rect width="400" height="300" fill="#f6f1e4" />
      {/* fields: soft patches */}
      <g>
        <path d="M-10 190c30-18 70-14 96 6 22 18 16 50-6 66-30 22-70 30-90 16z" fill="#e4ecd6" />
        <path d="M262 168c34-12 78-6 112 10 22 10 40 4 48-6v90c-40 22-96 28-134 6-26-16-42-60-26-100z" fill="#e8e9cd" />
        <path d="M110 238c30-10 70-4 92 14s10 44-20 50-66 0-82-14c-10-16-2-44 10-50z" fill="#dfe9d8" />
        <path d="M200 20c40-16 90-12 120 8s6 52-30 60-96 6-110-20c-6-22 2-40 20-48z" fill="#e6eee2" />
        <path d="M-10 60c30-20 60-16 90 0s20 52-14 56-76 0-86-22z" fill="#e8e9cd" />
      </g>
      {/* furrow lines on two fields */}
      <g stroke="#d3dcc2" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M290 190c30-8 60-4 90 8M284 204c32-8 66-4 98 8M286 218c30-6 60-2 90 8" />
        <path d="M-2 210c24-10 56-8 76 2M-4 224c24-10 56-8 80 4M0 238c22-8 50-6 70 4" />
      </g>
      {/* hills */}
      <g fill="#d6e2cb">
        <path d="M-10 -10h120c-6 24-24 40-48 44-24 4-44-8-72 2z" />
        <path d="M290 -10h130v70c-26-8-44-20-60-40-12-14-40-22-70-30z" />
      </g>
      <g fill="#c6d7bb" opacity="0.8">
        <path d="M-10 -10h70c-4 16-16 28-36 30-14 2-26-4-34 2z" />
        <path d="M340 -10h80v38c-20-4-34-14-44-26z" />
      </g>
      {/* winding river */}
      <path d="M118 -10C140 30 96 52 120 92s72 30 66 70-60 56-52 96 40 46 40 60" fill="none" stroke="#cfe3de" strokeWidth="22" strokeLinecap="round" />
      <path d="M118 -10C140 30 96 52 120 92s72 30 66 70-60 56-52 96 40 46 40 60" fill="none" stroke="#e1eeea" strokeWidth="11" strokeLinecap="round" />
      {/* dirt road (dashed) and main road */}
      <g fill="none" strokeLinecap="round">
        <path d="M200 182C230 200 250 224 304 240s70 30 110 24" stroke="#e3cfae" strokeWidth="5" strokeDasharray="1 7" />
        <path d="M200 176C190 140 150 120 96 120S20 100 -10 96" stroke="#e3cfae" strokeWidth="5" strokeDasharray="1 7" />
        <path d="M200 178C250 160 250 130 264 132s50-30 80-54 50-30 70-44" stroke="#e3cfae" strokeWidth="5" strokeDasharray="1 7" />
        <path d="M-10 206C60 214 120 196 200 182s150 6 220 -18" stroke="#ecdcc4" strokeWidth="12" />
        <path d="M-10 206C60 214 120 196 200 182s150 6 220 -18" stroke="#fffaf0" strokeWidth="7" />
      </g>
      {/* bridge */}
      <rect x="150" y="190" width="16" height="9" rx="3" fill="#fffaf0" stroke="#ecdcc4" strokeWidth="1.5" transform="rotate(-8 158 194)" />
      {/* trees */}
      <g>{[[70, 160], [84, 168], [96, 156], [300, 50], [316, 62], [330, 44], [248, 90], [350, 140], [364, 152], [226, 232], [214, 244], [40, 120], [30, 134], [176, 64]].map(([x, y]) => tree(x, y))}</g>
      {/* the town: a small cluster of houses and a church-like landmark */}
      <g>
        {[[176, 168], [186, 150, 11, 8], [206, 198], [218, 186, 11, 8], [172, 192, 11, 8], [236, 174, 11, 8], [190, 210, 10, 7], [240, 196, 10, 7]].map(([x, y, w, h]) => house(x, y, w, h))}
        <g>
          <rect x="204" y="152" width="16" height="14" rx="1.5" fill="#fffaf0" />
          <rect x="209" y="140" width="7" height="14" rx="1" fill="#fffaf0" />
          <path d="M207.5 141 L212.5 132 L217.5 141z" fill="#d9a186" />
          <path d="M212.5 128v5M210.5 130h4" stroke="#b98a70" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M210 166v-6a2 2 0 0 1 4 0v6z" fill="#e3cfae" />
        </g>
      </g>
    </svg>
  );
}

function CostBadge({ cost, label }: { cost: Clinic["cost"]; label: string }) {
  return <span className="inline-flex min-h-6 items-center rounded-full bg-dawn-100 px-3 py-0.5 text-sm text-ink">{label}</span>;
}

/** Small glyph inside the pin: person (promotora), cross (clinic), house (community center). */
function KindIcon({ kind }: { kind: ClinicKind }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {kind === "promotora" && (<><circle cx="6" cy="3.8" r="1.7" /><path d="M2.6 10c.3-2.2 1.6-3.2 3.4-3.2s3.1 1 3.4 3.2" /></>)}
      {kind === "clinic" && <path d="M6 2.2v7.6M2.2 6h7.6" />}
      {kind === "community" && <path d="M2 6 6 2.4 10 6M3.2 5.4v4.2h5.6V5.4" />}
    </svg>
  );
}

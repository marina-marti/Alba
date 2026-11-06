"use client";
import { useState } from "react";

export type Item = string | { section?: string; label?: string; text: string };
export type WeekCard = { id: string; title: string; body: Item[]; source?: string };

export default function WeekCards({ cards }: { cards: WeekCard[] }) {
  const [open, setOpen] = useState<string | null>(cards[0]?.id ?? null);
  return (
    <ul className="space-y-3">
      {cards.map((c, i) => {
        const isOpen = open === c.id;
        return (
          <li key={c.id} className="rounded-4xl bg-white/80 shadow-soft">
            <h2>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${c.id}-panel`}
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="flex min-h-14 w-full items-center gap-3 rounded-4xl px-5 py-4 text-left text-lg font-medium text-ink"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dawn-200 text-sm">{i + 1}</span>
                <span className="flex-1">{c.title}</span>
                <span aria-hidden className={`text-dawn-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
              </button>
            </h2>
            <div
              id={`${c.id}-panel`}
              role="region"
              aria-labelledby={undefined}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden" {...(isOpen ? {} : { inert: true })}>
                <div className="space-y-3 px-5 pb-5 text-[17px] leading-relaxed text-ink">
                  {c.body.map((b, j) =>
                    typeof b === "string" ? (
                      <p key={j}>{b}</p>
                    ) : (
                      <div key={j} className="rounded-2xl bg-sage-100 p-4">
                        {b.label && (
                          <span className="mb-2 inline-block rounded-full bg-sage-300 px-3 py-1 text-sm font-medium">{b.label}</span>
                        )}
                        <p>{b.text}</p>
                      </div>
                    )
                  )}
                  {c.source && <p className="text-sm text-ink-soft">Fuente: {c.source}</p>}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

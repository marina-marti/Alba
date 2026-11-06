"use client";
import { useState } from "react";
import { Chevron } from "@/components/Curves";
import { useI18n } from "@/lib/i18n/client";

export type Item = string | { section?: string; label?: string; text: string };
export type WeekCard = { id: string; title: string; body: Item[]; source?: string };

export default function WeekCards({ cards }: { cards: WeekCard[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(cards[0]?.id ?? null);
  return (
    <ul className="space-y-4">
      {cards.map((c, i) => {
        const isOpen = open === c.id;
        return (
          <li key={c.id} className="card !p-0">
            <h2>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${c.id}-panel`}
                onClick={() => setOpen(isOpen ? null : c.id)}
                className="flex min-h-16 w-full items-center gap-4 rounded-4xl px-6 py-5 text-left text-lg font-medium text-ink"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dawn-200 text-sm text-ink">{i + 1}</span>
                <span className="flex-1">{c.title}</span>
                <Chevron className={`h-5 w-5 shrink-0 text-dawn-500 transition-transform duration-500 ease-out ${isOpen ? "-rotate-90" : "rotate-90"}`} />
              </button>
            </h2>
            <div
              id={`${c.id}-panel`}
              role="region"
              aria-labelledby={undefined}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden" {...(isOpen ? {} : { inert: true })}>
                <div className="space-y-4 px-6 pb-7 text-[17px] leading-8 text-ink">
                  {c.body.map((b, j) =>
                    typeof b === "string" ? (
                      <p key={j}>{b}</p>
                    ) : (
                      <div key={j} className="border-l-2 border-sage-300 pl-4">
                        {b.label && (
                          <span className="mb-2 inline-block rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700">{b.label}</span>
                        )}
                        <p>{b.text}</p>
                      </div>
                    )
                  )}
                  {c.source && <p className="text-sm text-ink-soft">{t("week1.source")} {c.source}</p>}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

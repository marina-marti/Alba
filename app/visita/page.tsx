import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { getProfile } from "@/lib/db";
import { checklistState, confirmations } from "@/lib/simulated";
import { loadDemoChecklist, loadDemoSeedUser } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import { toggleItem, confirmAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { lang, t } = await getI18n();
  const list = loadDemoChecklist(lang);
  const seed = loadDemoSeedUser();
  const date = getProfile()?.appointment_date ?? seed.appointment_date; // which visit this is for: open (Q-13)
  const state = checklistState();
  const conf = confirmations();

  return (
    <div className="space-y-8">
      <h1 className="page-title">{list.title}</h1>
      <p className="text-lg text-ink-soft">{t("visit.date", { date })}</p>

      <Card>
        <ul className="space-y-1">
          {list.items.map((it) => {
            const done = state[it.id] ?? it.done;
            return (
              <li key={it.id}>
                <form action={toggleItem}>
                  <input type="hidden" name="id" value={it.id} />
                  <input type="hidden" name="done" value={done ? "0" : "1"} />
                  <button type="submit" role="checkbox" aria-checked={done}
                    className="flex min-h-12 w-full items-center gap-3 text-left">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-sage-600 bg-sage-600 text-white" : "border-dawn-400"}`}>{done ? "✓" : ""}</span>
                    <span className={done ? "text-ink-soft line-through" : ""}>{it.label}</span>
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </Card>

      {([
        ["clinic_call", t("visit.clinicTitle"), t("visit.clinicQ"), t("visit.clinicBtn"), t("visit.clinicOk")],
        ["visit_attended", t("visit.attendedTitle"), t("visit.attendedQ"), t("visit.attendedBtn"), t("visit.attendedOk")],
      ] as const).map(([kind, title, q, label, ok]) => (
        <Card key={kind}>
          <h2 className="font-serif text-xl">{title}</h2>
          <p className="mt-1 text-ink-soft">{q}</p>
          {conf[kind] ? (
            <p role="status" className="mt-3 rounded-3xl bg-sage-100 px-5 py-3">{ok}</p>
          ) : (
            <form action={confirmAction} className="mt-3">
              <input type="hidden" name="kind" value={kind} />
              <Button type="submit">{label}</Button>
            </form>
          )}
        </Card>
      ))}
    </div>
  );
}

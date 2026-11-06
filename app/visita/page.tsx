import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { getProfile } from "@/lib/db";
import { readDemo, checklistState, confirmations, type ChecklistItem } from "@/lib/simulated";
import { toggleItem, confirmAction } from "./actions";

export const dynamic = "force-dynamic";

export default function Page() {
  const list = readDemo<{ title: string; items: ChecklistItem[] }>("checklist.es.json");
  const seed = readDemo<{ appointment_date: string }>("seed-user.json");
  const date = getProfile()?.appointment_date ?? seed.appointment_date; // which visit this is for: open (Q-13)
  const state = checklistState();
  const conf = confirmations();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">{list.title}</h1>
      <p className="text-ink-soft">Tu cita: {date}</p>

      <Card>
        <ul className="space-y-2">
          {list.items.map((it) => {
            const done = state[it.id] ?? it.done;
            return (
              <li key={it.id}>
                <form action={toggleItem}>
                  <input type="hidden" name="id" value={it.id} />
                  <input type="hidden" name="done" value={done ? "0" : "1"} />
                  <button type="submit" role="checkbox" aria-checked={done}
                    className="flex min-h-12 w-full items-center gap-3 text-left">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${done ? "border-sage-600 bg-sage-600 text-white" : "border-dawn-300"}`}>{done ? "✓" : ""}</span>
                    <span className={done ? "text-ink-soft line-through" : ""}>{it.label}</span>
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </Card>

      {([
        ["clinic_call", "Llamar a tu clínica", "Ya van tres semanas. ¿Ya llamaste a tu clínica?", "Ya llamé a la clínica", "Anotado. ¡Gracias por avisarnos!"],
        ["visit_attended", "Después de tu cita", "¿Fuiste a tu cita?", "Fui a mi cita", "¡Qué bien! Lo celebramos contigo."],
      ] as const).map(([kind, title, q, label, ok]) => (
        <Card key={kind}>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-ink-soft">{q}</p>
          {conf[kind] ? (
            <p role="status" className="mt-3 rounded-2xl bg-sage-100 p-3">{ok}</p>
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

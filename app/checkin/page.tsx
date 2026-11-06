import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { submitCheckin } from "./actions";

const QUESTIONS = [
  { name: "bleeding", label: "Sangrado", low: "muy poco", high: "mucho" },
  { name: "pain", label: "Dolor", low: "nada", high: "mucho" },
  { name: "mood", label: "Ánimo", low: "bajo", high: "bien" },
  { name: "healing", label: "Sanación", low: "difícil", high: "va bien" },
];

function Scale({ name, label, low, high }: (typeof QUESTIONS)[number]) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-lg font-medium">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={name} value={n} required className="peer sr-only" />
            <span className="flex min-h-14 items-center justify-center rounded-full bg-white text-lg shadow-soft transition peer-checked:bg-dawn-400 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-dawn-500">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-sm opacity-70">
        <span>1 · {low}</span>
        <span>5 · {high}</span>
      </div>
    </fieldset>
  );
}

export default function Page() {
  return (
    <main className="mx-auto max-w-md space-y-5 px-5 py-6">
      <h1 className="text-xl font-semibold">¿Cómo estás hoy?</h1>
      <p className="opacity-80">Elige un número del 1 al 5. Solo toma un minuto.</p>
      <form action={submitCheckin} className="space-y-5">
        <Card className="space-y-6">
          <Scale {...QUESTIONS[0]} />
          <fieldset className="space-y-2">
            <legend className="font-medium">¿Empapaste una toalla en una hora?</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["0", "No"],
                ["1", "Sí"],
              ].map(([v, t]) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="pad_soak" value={v} defaultChecked={v === "0"} className="peer sr-only" />
                  <span className="flex min-h-14 items-center justify-center rounded-full bg-white text-lg shadow-soft transition peer-checked:bg-dawn-400 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-dawn-500">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </Card>
        {QUESTIONS.slice(1).map((q) => (
          <Card key={q.name}>
            <Scale {...q} />
          </Card>
        ))}
        <Card className="space-y-2">
          <label htmlFor="note" className="text-lg font-medium">
            Una nota (opcional)
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            maxLength={2000}
            placeholder="Lo que quieras recordar de hoy"
            className="w-full rounded-3xl bg-white p-4 shadow-soft"
          />
        </Card>
        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>
    </main>
  );
}

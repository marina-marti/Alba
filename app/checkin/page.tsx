import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { submitCheckin } from "./actions";
import { getI18n } from "@/lib/i18n/server";

const NAMES = ["bleeding", "pain", "mood", "healing"] as const;

function Scale({ name, label, low, high }: { name: string; label: string; low: string; high: string }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-lg font-medium">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={name} value={n} required className="peer sr-only" />
            <span className="choice">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="flex justify-between text-sm text-ink-soft">
        <span>1 · {low}</span>
        <span>5 · {high}</span>
      </div>
    </fieldset>
  );
}

export default async function Page() {
  const { t } = await getI18n();
  const QUESTIONS = NAMES.map((name) => ({
    name,
    label: t(`checkin.${name}`),
    low: t(`checkin.${name}.low`),
    high: t(`checkin.${name}.high`),
  }));
  return (
    <div className="space-y-8">
      <h1 className="page-title">{t("checkin.title")}</h1>
      <p className="text-lg text-ink-soft">{t("checkin.intro")}</p>
      <form action={submitCheckin} className="space-y-6">
        <Card className="space-y-8">
          <Scale {...QUESTIONS[0]} />
          <fieldset className="space-y-3">
            <legend className="text-lg font-medium">{t("checkin.padQ")}</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["0", t("checkin.no")],
                ["1", t("checkin.yes")],
              ].map(([v, t]) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="pad_soak" value={v} defaultChecked={v === "0"} className="peer sr-only" />
                  <span className="choice">
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
        <Card className="space-y-3">
          <label htmlFor="note" className="text-lg font-medium">
            {t("checkin.noteLabel")}
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            maxLength={2000}
            placeholder={t("checkin.notePlaceholder")}
            className="field"
          />
        </Card>
        <Button type="submit" className="w-full">
          {t("checkin.save")}
        </Button>
      </form>
    </div>
  );
}

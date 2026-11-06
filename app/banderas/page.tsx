import Link from "next/link";
import { loadRedFlags } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import Card from "@/components/Card";

export const metadata = { title: "Alba · Banderas rojas" };

export default async function Page() {
  const { lang, t } = await getI18n();
  const flags = loadRedFlags(lang);
  // Q-15 is open: 988 is not shown yet, so rf-7 shows only the TLC-MAMA line.
  const textFor = (id: string, text: string) => (id === "rf-7" ? t("flags.rf7") : text);
  return (
    <div className="space-y-6">
      <h1 className="page-title">{t("flags.title")}</h1>
      <p className="text-lg text-ink-soft">{t("flags.intro", { action: flags.action })}</p>
      <Card>
        <ul className="space-y-5">
          {flags.items.map((i) => (
            <li key={i.id} className="text-ink">
              {textFor(i.id, i.text)}
              {i.id === "rf-7" && (
                <>
                  {" "}
                  <a href="tel:18338526262" className="link">
                    1-833-TLC-MAMA (1-833-852-6262)
                  </a>
                  {t("flags.rf7suffix")}
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Link href="/alerta" className="btn w-full">
        {t("flags.call")}
      </Link>
    </div>
  );
}

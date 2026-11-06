import Link from "next/link";
import WeekCards from "./WeekCards";
import { loadWeek1 } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { lang, t } = await getI18n();
  const data = loadWeek1(lang);
  return (
    <div className="space-y-8">
      <h1 className="page-title">{t("week1.title")}</h1>
      <WeekCards cards={data.cards} />
      <div className="grid gap-4 pt-2">
        <Link href="/pregunta" className="btn">
          {t("week1.ask")}
        </Link>
        <Link href="/banderas" className="btn btn-quiet">
          {t("week1.whenToCall")}
        </Link>
      </div>
    </div>
  );
}

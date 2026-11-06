import Card from "@/components/Card";
import { ButtonLink } from "@/components/Button";
import { getI18n } from "@/lib/i18n/server";

export default async function Page() {
  const { t } = await getI18n();
  return (
    <div className="space-y-8 pt-6">
      <Card className="space-y-3 px-7 py-10 text-center">
        <h1 className="page-title">{t("checkin.thanksTitle")}</h1>
        <p className="text-lg text-ink-soft">{t("checkin.thanksText")}</p>
      </Card>
      <ButtonLink href="/" className="w-full">
        {t("checkin.back")}
      </ButtonLink>
    </div>
  );
}

import { getI18n } from "@/lib/i18n/server";

export default async function Page() {
  const { t } = await getI18n();
  return <h1 className="page-title">{t("movement.title")}</h1>;
}

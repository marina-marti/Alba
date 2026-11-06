import Link from "next/link";
import { loadDemoClinics } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import ClinicMap from "./ClinicMap";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alba" };

// ?pin=2 preselects the second clinic (used for screenshots).
export default async function Page({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
  const { pin } = await searchParams;
  const { lang, t } = await getI18n();
  const { clinics } = loadDemoClinics(lang);
  const n = Number(pin);
  const initial = Number.isInteger(n) && n >= 1 && n <= clinics.length ? n : null;

  return (
    <div className="space-y-6">
      <h1 className="page-title">{t("clinics.title")}</h1>
      <p className="text-lg text-ink-soft">{t("clinics.intro")}</p>
      <ClinicMap clinics={clinics} initialRank={initial} />
      <p className="text-sm text-ink-soft">
        {t("clinics.note")}{" "}
        {t("clinics.urgent")}{" "}
        <Link href="/alerta" className="link">{t("alert.title")}</Link>
      </p>
    </div>
  );
}

import AskForm from "./AskForm";
import { getI18n } from "@/lib/i18n/server";

export default async function Page({ searchParams }: { searchParams: Promise<{ desde?: string | string[] }> }) {
  const sp = await searchParams;
  const { t } = await getI18n();
  const raw = Array.isArray(sp.desde) ? sp.desde[0] : sp.desde;
  const desde = (raw ?? "").replace(/[^\p{L}\p{N}\s\-_/]/gu, "").trim().slice(0, 60);
  return (
    <div className="space-y-6">
      <h1 className="page-title">{t("ask.title")}</h1>
      {desde && <p className="text-sm text-ink-soft">{t("ask.from", { desde })}</p>}
      <AskForm page={desde} />
    </div>
  );
}

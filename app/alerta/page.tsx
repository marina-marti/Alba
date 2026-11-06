import { getProfile } from "@/lib/db";
import { loadRedFlags } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alba" };

function telHref(raw: string | null | undefined): { href: string; label: string } {
  const digits = (raw ?? "").replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length < 7) return { href: "tel:911", label: "911" };
  return { href: `tel:${digits}`, label: raw!.trim() };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams;
  const { lang, t } = await getI18n();
  const flags = loadRedFlags(lang);
  const padText = flags.items.find((i) => i.id === "rf-1")!.text;
  const support = motivo === "animo" || motivo === "selfharm";
  const clinic = telHref(getProfile()?.clinic_phone);
  const hotline = { href: "tel:18338526262", label: "1-833-TLC-MAMA (1-833-852-6262)" };

  return (
    <main className="fixed inset-0 z-50 flex flex-col items-stretch justify-center gap-7 overflow-y-auto bg-coral-600 px-6 py-10 text-center text-white">
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-1/3 rounded-b-[50%] bg-coral-700/40" />
      {support ? (
        <>
          <h1 className="font-serif text-4xl font-normal leading-tight text-white">{t("alert.supportTitle")}</h1>
          <p className="text-xl text-white">
            {motivo === "selfharm"
              ? t("alert.selfharm")
              : t("alert.mood")}
          </p>
          <a href={hotline.href} className="btn mx-auto min-h-16 w-full max-w-sm !bg-coral-50 px-6 py-4 text-lg font-bold [text-wrap:balance] !text-coral-700 hover:!bg-white">
            {t("alert.callHotline", { label: hotline.label })}
          </a>
          <p className="text-white">{t("alert.free")}</p>
          {motivo === "selfharm" && (
            <p className="text-white">{t("alert.selfharm911")}</p>
          )}
        </>
      ) : (
        <>
          <h1 className="font-serif text-5xl font-bold leading-tight text-white">{t("alert.title")}</h1>
          <p className="text-xl text-white">{padText}</p>
          <p className="text-2xl font-semibold text-white">{flags.action.charAt(0).toUpperCase() + flags.action.slice(1)}.</p>
          <a href={clinic.href} className="btn mx-auto min-h-20 w-full max-w-sm !bg-coral-50 px-6 py-5 text-2xl font-bold !text-coral-700 hover:!bg-white">
            {t("alert.callNow", { label: clinic.label })}
          </a>
          {clinic.label !== "911" && (
            <a href="tel:911" className="text-lg font-medium text-white underline underline-offset-4">{t("alert.emergency")}</a>
          )}
        </>
      )}
      <a href="/" className="mx-auto inline-flex min-h-11 items-center text-base text-white underline underline-offset-4">{t("alert.back")}</a>
    </main>
  );
}

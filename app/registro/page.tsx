import { redirect } from "next/navigation";
import Card from "@/components/Card";
import { Button, ButtonLink } from "@/components/Button";
import { saveProfile } from "@/lib/db";
import { startDemoSession } from "@/lib/session";
import { getI18n } from "@/lib/i18n/server";

// Consent text is a placeholder, wording open (Q-25): dictionary key reg.consent.
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE = /^\+?[\d\s().-]{7,20}$/;

async function registrar(formData: FormData) {
  "use server";
  const s = (k: string) => String(formData.get(k) ?? "").trim();
  const whatsapp = s("whatsapp"), delivery = s("delivery_date");
  const appt = s("appointment_date"), clinic = s("clinic_phone");
  const consent = formData.get("consent") === "on";
  const bad =
    !PHONE.test(whatsapp) || !DATE.test(delivery) || !consent ||
    (appt !== "" && !DATE.test(appt)) || (clinic !== "" && !PHONE.test(clinic));
  if (bad) redirect("/registro?error=1");
  saveProfile({
    whatsapp,
    delivery_date: delivery,
    consent: 1,
    ...(appt ? { appointment_date: appt } : {}),
    ...(clinic ? { clinic_phone: clinic } : {}),
  });
  await startDemoSession();
  redirect("/registro?ok=1");
}

const input = "field";

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const { t } = await getI18n();
  if (ok) {
    return (
      <div className="space-y-8">
        <h1 className="page-title">{t("reg.okTitle")}</h1>
        <Card className="space-y-5">
          <p>{t("reg.okText")}</p>
          <ButtonLink href="/checkin">{t("reg.okBtn")}</ButtonLink>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <h1 className="page-title">{t("reg.title")}</h1>
      <Card>
        <form action={registrar} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("reg.whatsapp")}</span>
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required className={input} placeholder="+1 555 123 4567" />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("reg.delivery")}</span>
            <input name="delivery_date" type="date" required className={input} />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("reg.appointment")}</span>
            <input name="appointment_date" type="date" className={input} />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("reg.clinic")}</span>
            <input name="clinic_phone" type="tel" inputMode="tel" className={input} placeholder="+1 555 987 6543" />
          </label>
          <label className="flex items-start gap-3">
            <input name="consent" type="checkbox" required className="mt-1 h-6 w-6 shrink-0 accent-sage-600" />
            <span className="text-base text-ink-soft">{t("reg.consent")}</span>
          </label>
          {error && <p role="alert" className="text-sm">{t("reg.error")}</p>}
          <Button type="submit" className="w-full">{t("reg.submit")}</Button>
        </form>
      </Card>
      <p className="text-center text-base text-ink-soft">{t("reg.already")} <a className="link" href="/login">{t("reg.login")}</a></p>
    </div>
  );
}

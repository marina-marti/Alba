import { redirect } from "next/navigation";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { getProfile, saveProfile } from "@/lib/db";
import { daysSince, weekLine } from "@/lib/today";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE = /^\+?[\d\s().-]{7,20}$/;

// REQ-49: the appointment date and clinic phone are entered here. Empty fields keep what is stored.
async function guardar(formData: FormData) {
  "use server";
  const s = (k: string) => String(formData.get(k) ?? "").trim();
  const delivery = s("delivery_date"), appt = s("appointment_date");
  const clinic = s("clinic_phone"), whatsapp = s("whatsapp");
  const bad =
    (delivery !== "" && !DATE.test(delivery)) || (appt !== "" && !DATE.test(appt)) ||
    (clinic !== "" && !PHONE.test(clinic)) || (whatsapp !== "" && !PHONE.test(whatsapp));
  if (bad) redirect("/perfil?error=1");
  saveProfile({
    ...(delivery ? { delivery_date: delivery } : {}),
    ...(appt ? { appointment_date: appt } : {}),
    ...(clinic ? { clinic_phone: clinic } : {}),
    ...(whatsapp ? { whatsapp } : {}),
  });
  redirect("/perfil?ok=1");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const { lang, t } = await getI18n();
  const p = getProfile();
  const days = daysSince(p?.delivery_date, new Date());

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <span aria-hidden className="profile-bubble !h-16 !w-16 !text-3xl">{(p?.name?.trim()[0] ?? "A").toUpperCase()}</span>
        <div>
          <h1 className="page-title">{p?.name ?? t("profile.title")}</h1>
          <p className="text-lg text-dawn-600">{days !== null ? weekLine(days, lang) : t("profile.noDate")}</p>
        </div>
      </div>
      {ok && <p role="status" className="card text-base text-ink">{t("profile.saved")}</p>}
      <Card>
        <p className="mb-5 text-base text-ink-soft">{t("profile.intro")}</p>
        <form action={guardar} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("profile.delivery")}</span>
            <input name="delivery_date" type="date" defaultValue={p?.delivery_date ?? ""} className="field" />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("profile.appointment")}</span>
            <input name="appointment_date" type="date" defaultValue={p?.appointment_date ?? ""} className="field" />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("profile.clinic")}</span>
            <input name="clinic_phone" type="tel" inputMode="tel" defaultValue={p?.clinic_phone ?? ""} className="field" />
          </label>
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("profile.whatsapp")}</span>
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" defaultValue={p?.whatsapp ?? ""} className="field" />
          </label>
          {error && <p role="alert" className="text-sm">{t("profile.error")}</p>}
          <Button type="submit" className="w-full">{t("profile.save")}</Button>
        </form>
      </Card>
    </div>
  );
}

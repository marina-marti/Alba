import { redirect } from "next/navigation";
import Card from "@/components/Card";
import { Button, ButtonLink } from "@/components/Button";
import { saveProfile } from "@/lib/db";
import { startDemoSession } from "@/lib/session";

const CONSENT_TEXT = "Texto de consentimiento provisional"; // placeholder, wording open (Q-25)
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

const input = "min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4";

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  if (ok) {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-semibold">Tu espacio está listo</h1>
        <Card className="space-y-4">
          <p>Listo, guardamos tus datos. Gracias por confiar en Alba.</p>
          <ButtonLink href="/checkin">Hacer mi primer check-in</ButtonLink>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Crear tu espacio</h1>
      <Card>
        <form action={registrar} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm">Tu número de WhatsApp</span>
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required className={input} placeholder="+1 555 123 4567" />
          </label>
          <label className="block space-y-2">
            <span className="text-sm">Fecha de parto</span>
            <input name="delivery_date" type="date" required className={input} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm">Fecha de tu cita (opcional)</span>
            <input name="appointment_date" type="date" className={input} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm">Teléfono de tu clínica (opcional)</span>
            <input name="clinic_phone" type="tel" inputMode="tel" className={input} placeholder="+1 555 987 6543" />
          </label>
          <label className="flex items-start gap-3">
            <input name="consent" type="checkbox" required className="mt-1 h-6 w-6 shrink-0" />
            <span className="text-sm">{CONSENT_TEXT}</span>
          </label>
          {error && <p role="alert" className="text-sm">Revisa tus datos: el WhatsApp, la fecha de parto y el consentimiento son necesarios.</p>}
          <Button type="submit" className="w-full">Crear mi espacio</Button>
        </form>
      </Card>
      <p className="text-center text-sm">¿Ya tienes espacio? <a className="underline" href="/login">Entrar</a></p>
    </div>
  );
}

import { getProfile } from "@/lib/db";
import flags from "@/content/redflags.es.json";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alba" };

const padText = flags.items.find((i) => i.id === "rf-1")!.text;

function telHref(raw: string | null | undefined): { href: string; label: string } {
  const digits = (raw ?? "").replace(/[^\d+]/g, "");
  if (digits.replace(/\D/g, "").length < 7) return { href: "tel:911", label: "911" };
  return { href: `tel:${digits}`, label: raw!.trim() };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams;
  const support = motivo === "animo" || motivo === "selfharm";
  const clinic = telHref(getProfile()?.clinic_phone);
  const hotline = { href: "tel:18338526262", label: "1-833-TLC-MAMA (1-833-852-6262)" };

  return (
    <main className="fixed inset-0 z-50 flex flex-col justify-center gap-6 overflow-y-auto bg-dawn-50 px-6 py-8 text-center">
      {support ? (
        <>
          <h1 className="text-3xl font-semibold text-ink">No estás sola</h1>
          <p className="text-lg text-ink-soft">
            {motivo === "selfharm"
              ? "Lo que sientes importa. Habla ahora con alguien que te escucha, en español, a cualquier hora."
              : "Estos días han sido pesados. Hablar con alguien puede ayudar, y no tienes que esperar."}
          </p>
          <a href={hotline.href} className="mx-auto inline-flex min-h-16 w-full max-w-sm items-center justify-center rounded-full bg-dawn-500 px-6 py-4 text-xl font-semibold text-white shadow-soft active:scale-[0.98]">
            Llamar a {hotline.label}
          </a>
          <p className="text-ink-soft">Gratis, confidencial, 24/7, en español e inglés.</p>
          {motivo === "selfharm" && (
            <p className="text-ink-soft">Si sientes que puedes hacerte daño ahora mismo, llama al 911.</p>
          )}
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-ink">Llama hoy, no esperes</h1>
          <p className="text-lg text-ink">{padText}</p>
          <p className="text-xl font-medium text-ink">{flags.action.charAt(0).toUpperCase() + flags.action.slice(1)}.</p>
          <a href={clinic.href} className="mx-auto inline-flex min-h-20 w-full max-w-sm items-center justify-center rounded-full bg-dawn-500 px-6 py-5 text-2xl font-semibold text-white shadow-soft active:scale-[0.98]">
            Llamar ahora: {clinic.label}
          </a>
          {clinic.label !== "911" && (
            <a href="tel:911" className="text-lg text-ink-soft underline">Si es una emergencia, llama al 911</a>
          )}
        </>
      )}
      <a href="/" className="text-sm text-ink-soft underline">Volver al inicio</a>
    </main>
  );
}

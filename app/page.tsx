import Card from "@/components/Card";
import { ButtonLink } from "@/components/Button";
import { Blob, Chevron } from "@/components/Curves";
import { getI18n } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n/es";

const links: { href: string; label: Key }[] = [
  { href: "/semana-1", label: "home.week1" },
  { href: "/checkin", label: "home.checkin" },
  { href: "/pregunta", label: "home.ask" },
  { href: "/resumen", label: "home.summary" },
  { href: "/circulo", label: "home.circle" },
  { href: "/entrenamiento", label: "home.movement" },
];

export default async function Home() {
  const { t } = await getI18n();
  return (
    <div className="space-y-10">
      <Card className="relative overflow-hidden px-7 py-10">
        <Blob className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 text-dawn-200/70" />
        <h1 className="page-title relative">{t("home.greeting")}</h1>
        <p className="relative mt-3 text-lg text-ink-soft">{t("home.sub")}</p>
      </Card>
      <div className="grid gap-4">
        {links.map((l) => (
          <ButtonLink key={l.href} href={l.href} variant="quiet" className="justify-between !px-7 text-left">
            {t(l.label)}
            <Chevron className="h-5 w-5 shrink-0 text-dawn-500" />
          </ButtonLink>
        ))}
        <ButtonLink href="/registro" className="mt-4">{t("home.start")}</ButtonLink>
        <ButtonLink href="/login" variant="sage">
          {t("home.login")}
        </ButtonLink>
      </div>
    </div>
  );
}

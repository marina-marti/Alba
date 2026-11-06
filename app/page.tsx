import Card from "@/components/Card";
import { ButtonLink } from "@/components/Button";

const links = [
  { href: "/semana-1", label: "Tu primera semana" },
  { href: "/checkin", label: "¿Cómo estás hoy?" },
  { href: "/pregunta", label: "Pregúntale a Alba" },
  { href: "/resumen", label: "Resumen para tu cita" },
  { href: "/circulo", label: "Círculo" },
  { href: "/entrenamiento", label: "Movimiento suave" },
];

export default function Home() {
  return (
    <div className="space-y-5">
      <Card>
        <h1 className="text-2xl font-semibold">Buenos días</h1>
        <p className="mt-2 text-ink-soft">Un momento tranquilo, solo para ti.</p>
      </Card>
      <div className="grid gap-3">
        {links.map((l) => (
          <ButtonLink key={l.href} href={l.href} className="bg-white !text-ink hover:!bg-dawn-100">
            {l.label}
          </ButtonLink>
        ))}
        <ButtonLink href="/registro">Empezar</ButtonLink>
        <ButtonLink href="/login" className="bg-sage-300 !text-ink hover:!bg-sage-100">
          Entrar
        </ButtonLink>
      </div>
    </div>
  );
}

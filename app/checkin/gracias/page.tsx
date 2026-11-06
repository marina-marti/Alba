import Card from "@/components/Card";
import { ButtonLink } from "@/components/Button";

export default function Page() {
  return (
    <div className="space-y-8 pt-6">
      <Card className="space-y-3 px-7 py-10 text-center">
        <h1 className="page-title">Gracias por contarnos</h1>
        <p className="text-lg text-ink-soft">Tu registro de hoy quedó guardado. Cuidarte también es descansar.</p>
      </Card>
      <ButtonLink href="/" className="w-full">
        Volver al inicio
      </ButtonLink>
    </div>
  );
}

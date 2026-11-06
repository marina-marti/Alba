import Card from "@/components/Card";
import { ButtonLink } from "@/components/Button";

export default function Page() {
  return (
    <main className="mx-auto max-w-md space-y-5 px-5 py-10">
      <Card className="space-y-3 text-center">
        <h1 className="text-xl font-semibold">Gracias por contarnos</h1>
        <p className="opacity-80">Tu registro de hoy quedó guardado. Cuidarte también es descansar.</p>
      </Card>
      <ButtonLink href="/" className="w-full">
        Volver al inicio
      </ButtonLink>
    </main>
  );
}

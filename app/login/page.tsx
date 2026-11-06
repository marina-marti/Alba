import { redirect } from "next/navigation";
import Card from "@/components/Card";
import { Button, ButtonLink } from "@/components/Button";
import { startDemoSession } from "@/lib/session";
import { getProfile } from "@/lib/db";

async function entrar(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/login?error=1");
  // Demo: single demo user, no real authentication (OOS-6). The typed value is not stored.
  await startDemoSession();
  redirect(getProfile()?.consent ? "/checkin" : "/registro");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold">Entrar</h1>
      <Card>
        <form action={entrar} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm">Tu número de teléfono o correo electrónico</span>
            <input
              name="id"
              type="text"
              inputMode="email"
              autoComplete="username"
              required
              className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4"
              placeholder="+1 555 123 4567"
            />
          </label>
          {error && <p role="alert" className="text-sm">Escribe tu teléfono o correo para entrar.</p>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </Card>
      <p className="text-center text-sm">
        ¿Primera vez? <ButtonLink href="/registro" className="ml-2 !min-h-10 !px-4 !py-2">Crear mi espacio</ButtonLink>
      </p>
    </div>
  );
}

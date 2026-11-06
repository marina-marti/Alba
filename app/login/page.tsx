import { redirect } from "next/navigation";
import Card from "@/components/Card";
import { Button, ButtonLink } from "@/components/Button";
import { startDemoSession } from "@/lib/session";
import { getProfile } from "@/lib/db";
import { getI18n } from "@/lib/i18n/server";

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
  const { t } = await getI18n();
  return (
    <div className="space-y-8">
      <h1 className="page-title">{t("login.title")}</h1>
      <Card>
        <form action={entrar} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-base text-ink-soft">{t("login.label")}</span>
            <input
              name="id"
              type="text"
              inputMode="email"
              autoComplete="username"
              required
              className="field"
              placeholder="+1 555 123 4567"
            />
          </label>
          {error && <p role="alert" className="text-sm">{t("login.error")}</p>}
          <Button type="submit" className="w-full">{t("login.submit")}</Button>
        </form>
      </Card>
      <p className="text-center text-base text-ink-soft">
        {t("login.first")} <ButtonLink href="/registro" variant="quiet" className="ml-2 !min-h-11 !px-5 !py-2">{t("login.create")}</ButtonLink>
      </p>
    </div>
  );
}

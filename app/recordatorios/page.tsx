import { loadDemoTimeline } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// SIMULATED: a mock WhatsApp-style view of timeline.es.json. Nothing is sent. Counts/timing of reminders are open (Q-16).
export default async function Page() {
  const { lang, t } = await getI18n();
  const { events } = loadDemoTimeline(lang);
  const msgs = events.filter((e) => e.channel === "whatsapp");
  return (
    <div className="space-y-6">
      <h1 className="page-title">{t("reminders.title")}</h1>
      <p className="text-base text-ink-soft">{t("reminders.intro")}</p>
      <div className="space-y-5 rounded-4xl bg-sage-100/70 p-6">
        {msgs.map((m, i) => (
          <div key={i} className="max-w-[85%]">
            <p className="mb-1 text-xs text-ink-soft">{t("reminders.day", { n: m.day })}</p>
            <p className="rounded-3xl rounded-tl-md bg-white p-4 shadow-soft">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

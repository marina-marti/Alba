import { readDemo, type TimelineEvent } from "@/lib/simulated";

export const dynamic = "force-dynamic";

// SIMULATED: a mock WhatsApp-style view of timeline.es.json. Nothing is sent. Counts/timing of reminders are open (Q-16).
export default function Page() {
  const { events } = readDemo<{ events: TimelineEvent[] }>("timeline.es.json");
  const msgs = events.filter((e) => e.channel === "whatsapp");
  return (
    <div className="space-y-6">
      <h1 className="page-title">Mensajes de Alba</h1>
      <p className="text-base text-ink-soft">Así llegan tus mensajes por WhatsApp. Vista de demostración.</p>
      <div className="space-y-5 rounded-4xl bg-sage-100/70 p-6">
        {msgs.map((m, i) => (
          <div key={i} className="max-w-[85%]">
            <p className="mb-1 text-xs text-ink-soft">Día {m.day}</p>
            <p className="rounded-3xl rounded-tl-md bg-white p-4 shadow-soft">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import RoomIcon from "@/components/RoomIcon";
import { Button } from "@/components/Button";
import { listRoomMessages } from "@/lib/simulated";
import { loadCircleRooms } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import { agoParts, minutesSince } from "@/lib/rooms-core";
import { sendRoomMessage } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alba" };

export default async function Page({ params }: { params: Promise<{ room: string }> }) {
  const { room: slug } = await params;
  const { lang, t } = await getI18n();
  const room = loadCircleRooms(lang).find((r) => r.slug === slug);
  if (!room) notFound();

  const ago = (m: number) => { const a = agoParts(m); return t(a.key, { n: a.n }); };
  const seeded = [...room.messages].sort((a, b) => b.minutesAgo - a.minutesAgo);
  const mine = listRoomMessages(room.slug);

  return (
    <div className="space-y-5">
      <Link href="/circulo" className="link inline-flex min-h-11 items-center">← {t("room.back")}</Link>

      <header className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
          <RoomIcon name={room.icon} />
        </span>
        <div>
          <h1 className="page-title !text-[1.75rem]">{room.name}</h1>
          <p className="text-ink-soft">{room.description}</p>
        </div>
      </header>

      {room.banner && (
        <aside aria-label={t("room.noticeAria")} className="card !bg-dawn-100 !p-5">
          <p>{room.banner.text}</p>
          {room.banner.link && <p className="mt-2"><Link href={room.banner.link.href} className="link">{room.banner.link.label}</Link></p>}
        </aside>
      )}

      <p className="text-center text-xs text-ink-soft">{t("room.demoNote")}</p>

      <ol aria-label={t("room.threadAria")} className="space-y-4">
        {seeded.map((m, i) => (
          <li key={i} className="flex flex-col items-start">
            <div className={`bubble ${m.who === "promotora" ? "bubble-pro" : "bubble-mom"}`}>
              <p className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                {m.who === "promotora"
                  ? <span className="rounded-full bg-white/80 px-2 py-0.5 text-[0.7rem] font-medium leading-tight text-dawn-600">{t("room.promotora")}</span>
                  : <span className="font-medium text-ink">{m.alias}</span>}
                <span>· {ago(m.minutesAgo)}</span>
              </p>
              {m.kind === "audio" ? (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-3">
                    <button type="button" disabled aria-label={t("room.playAria")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-dawn-600 opacity-80">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                    </button>
                    <span className="text-sm text-ink-soft">{t("room.audioTip")} · {m.duration}<br />{t("room.audioNote")}</span>
                  </div>
                  <p className="text-sm font-medium">{t("room.transcript")}</p>
                  <p>{m.text}</p>
                </div>
              ) : (
                <p className="mt-1">{m.text}</p>
              )}
            </div>
          </li>
        ))}
        {mine.map((m) => (
          <li key={`u${m.id}`} className="flex flex-col items-end">
            <div className="bubble bubble-me">
              <p className="text-xs text-ink-soft"><span className="font-medium text-ink">{m.alias}</span> · {t("room.you")} · {ago(minutesSince(m.created_at))}</p>
              <p className="mt-1 whitespace-pre-wrap">{m.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <form action={sendRoomMessage} className="room-composer">
        <input type="hidden" name="room" value={room.slug} />
        <label htmlFor="text" className="sr-only">{t("room.composerLabel")}</label>
        <div className="flex items-end gap-2">
          <textarea id="text" name="text" required maxLength={500} rows={1} className="field !min-h-12 flex-1 resize-none !rounded-3xl" placeholder={t("room.placeholder")} />
          <Button type="submit" className="shrink-0 !px-6">{t("room.send")}</Button>
        </div>
        <p className="mt-1 px-3 text-xs text-ink-soft">{t("room.aliasNote")}</p>
      </form>
    </div>
  );
}

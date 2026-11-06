import Link from "next/link";
import RoomIcon from "@/components/RoomIcon";
import { latestRoomMessages } from "@/lib/simulated";
import { loadCircleRooms } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import { agoParts, minutesSince } from "@/lib/rooms-core";

export const dynamic = "force-dynamic";
export const metadata = { title: "Alba" };

export default async function Page() {
  const { lang, t } = await getI18n();
  const rooms = loadCircleRooms(lang);
  const stored = latestRoomMessages();
  const ago = (m: number) => { const a = agoParts(m); return t(a.key, { n: a.n }); };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="page-title">{t("room.title")}</h1>
        <p className="text-lg text-ink-soft">{t("room.intro")}</p>
      </div>

      <ul aria-label={t("room.listAria")} className="space-y-4">
        {rooms.map((r) => {
          const seed = [...r.messages].sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
          const mine = stored[r.slug];
          const last = mine
            ? { text: mine.text, pro: false, when: ago(minutesSince(mine.created_at)) }
            : { text: seed.text, pro: seed.who === "promotora", when: ago(seed.minutesAgo) };
          return (
            <li key={r.id}>
              <Link href={`/circulo/${r.slug}`} className="card flex items-center gap-4 !p-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                  <RoomIcon name={r.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-xl leading-snug text-ink">{r.name}</span>
                  <span className="mt-0.5 flex items-center gap-2 text-xs text-ink-soft">
                    {last.pro && <span className="shrink-0 rounded-full bg-dawn-200 px-2 py-0.5 text-[0.7rem] font-medium leading-tight text-dawn-600">{t("room.promotora")}</span>}
                    <span>{last.when}</span>
                  </span>
                  <span className="mt-1 block truncate text-sm text-ink-soft">{last.text}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Content loader (REQ-3, REQ-53). Spanish = content/*.es.json (seed-qa.json); English = content/*.en.json.
import fs from "node:fs";
import path from "node:path";
import type { Lang } from "@/lib/i18n/lang";
import type { WeekCard } from "@/app/semana-1/WeekCards";
import { loadGuardrails, loadSeed } from "@/lib/ask-alba";
import type { Clinic } from "@/lib/clinics";
import type { CirclePost, Tip, TimelineEvent, ChecklistItem, RoomContent } from "@/lib/simulated";

export { loadGuardrails };

function readJson<T>(...parts: string[]): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", ...parts), "utf8")) as T;
}

export type RedFlags = {
  id: string; lang: string; heading: string; action: string;
  items: { id: string; bleeding: boolean; text: string }[];
};

export function loadWeek1(lang: Lang) {
  return readJson<{ week: number; cards: WeekCard[] }>(`week1.${lang}.json`);
}
export function loadRedFlags(lang: Lang) {
  return readJson<RedFlags>(`redflags.${lang}.json`);
}
export function loadSeedQa(lang: Lang) {
  return loadSeed(lang);
}
export function loadDemoCircle(lang: Lang) {
  return readJson<{ posts: CirclePost[]; tips: Tip[] }>("demo", `circle.${lang}.json`);
}
export function loadCircleRooms(lang: Lang) {
  return readJson<{ simulated: true; rooms: RoomContent[] }>("demo", `circle-rooms.${lang}.json`).rooms;
}
export function loadDemoTimeline(lang: Lang) {
  return readJson<{ events: TimelineEvent[] }>("demo", `timeline.${lang}.json`);
}
export function loadDemoChecklist(lang: Lang) {
  return readJson<{ title: string; items: ChecklistItem[] }>("demo", `checklist.${lang}.json`);
}
export function loadDemoClinics(lang: Lang) {
  return readJson<{ clinics: Clinic[] }>("demo", `clinics.${lang}.json`);
}
/** Data, not translated. */
export function loadDemoSeedUser() {
  return readJson<{ appointment_date: string }>("demo", "seed-user.json");
}

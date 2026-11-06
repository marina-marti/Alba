import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import WeekCards, { type WeekCard } from "./WeekCards";

export const dynamic = "force-dynamic";

export default function Page() {
  const file = path.join(process.cwd(), "content", "week1.es.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { cards: WeekCard[] };
  return (
    <div className="space-y-5 pb-24">
      <h1 className="text-2xl font-semibold">Tu primera semana</h1>
      <WeekCards cards={data.cards} />
      <div className="grid gap-3">
        <Link href="/pregunta" className="inline-flex min-h-12 items-center justify-center rounded-full bg-dawn-400 px-6 py-3 font-medium text-white shadow-soft hover:bg-dawn-500">
          Pregúntale a Alba
        </Link>
        <Link href="/banderas" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-medium text-ink shadow-soft hover:bg-dawn-100">
          Cuándo llamar a tu médico
        </Link>
      </div>
    </div>
  );
}

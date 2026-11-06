import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import WeekCards, { type WeekCard } from "./WeekCards";

export const dynamic = "force-dynamic";

export default function Page() {
  const file = path.join(process.cwd(), "content", "week1.es.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as { cards: WeekCard[] };
  return (
    <div className="space-y-8">
      <h1 className="page-title">Tu primera semana</h1>
      <WeekCards cards={data.cards} />
      <div className="grid gap-4 pt-2">
        <Link href="/pregunta" className="btn">
          Pregúntale a Alba
        </Link>
        <Link href="/banderas" className="btn btn-quiet">
          Cuándo llamar a tu médico
        </Link>
      </div>
    </div>
  );
}

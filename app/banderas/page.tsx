import Link from "next/link";
import flags from "@/content/redflags.es.json";
import Card from "@/components/Card";

export const metadata = { title: "Alba · Banderas rojas" };

// Q-15 is open: 988 is not shown yet, so rf-7 shows only the TLC-MAMA line.
function textFor(id: string, text: string) {
  return id === "rf-7" ? "Pensamientos de hacerte daño a ti o al bebé." : text;
}

export default function Page() {
  return (
    <main className="mx-auto max-w-md space-y-4 px-5 pb-28 pt-6">
      <h1 className="text-2xl font-semibold text-ink">Banderas rojas</h1>
      <p className="text-ink-soft">Llama hoy, no esperes. Si notas alguna de estas señales, {flags.action}.</p>
      <Card>
        <ul className="space-y-3">
          {flags.items.map((i) => (
            <li key={i.id} className="text-ink">
              {textFor(i.id, i.text)}
              {i.id === "rf-7" && (
                <>
                  {" "}
                  <a href="tel:18338526262" className="font-medium text-dawn-500 underline">
                    1-833-TLC-MAMA (1-833-852-6262)
                  </a>
                  , gratis, confidencial, 24/7, en español e inglés.
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Link href="/alerta" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-dawn-400 px-6 py-3 font-medium text-white shadow-soft">
        Llamar ahora
      </Link>
    </main>
  );
}

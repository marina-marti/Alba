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
    <div className="space-y-6">
      <h1 className="page-title">Banderas rojas</h1>
      <p className="text-lg text-ink-soft">Llama hoy, no esperes. Si notas alguna de estas señales, {flags.action}.</p>
      <Card>
        <ul className="space-y-5">
          {flags.items.map((i) => (
            <li key={i.id} className="text-ink">
              {textFor(i.id, i.text)}
              {i.id === "rf-7" && (
                <>
                  {" "}
                  <a href="tel:18338526262" className="link">
                    1-833-TLC-MAMA (1-833-852-6262)
                  </a>
                  , gratis, confidencial, 24/7, en español e inglés.
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>
      <Link href="/alerta" className="btn w-full">
        Llamar ahora
      </Link>
    </div>
  );
}

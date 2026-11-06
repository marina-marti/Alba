import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { readDemo, listUserPosts, type CirclePost, type Tip } from "@/lib/simulated";
import { publish } from "./actions";

export const dynamic = "force-dynamic";
const topic: Record<string, string> = { sanar: "Sanar", lactancia: "Lactancia", "cuidado de niños": "Cuidado de niños" };

export default function Page() {
  const { posts, tips } = readDemo<{ posts: CirclePost[]; tips: Tip[] }>("circle.es.json");
  const mine = listUserPosts();
  const replies = (id: string) => posts.filter((p) => p.reply_to === id);
  const top = posts.filter((p) => !p.reply_to);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Círculo</h1>
      <p className="text-ink-soft">Un espacio pequeño y cuidado para hablar con promotoras y con otras mamás.</p>

      <Card>
        <form action={publish} className="space-y-3">
          <label htmlFor="text" className="font-medium">Comparte algo, sin tu nombre</label>
          <textarea id="text" name="text" required maxLength={500} rows={3}
            className="w-full rounded-2xl border border-dawn-200 bg-dawn-50 p-3" placeholder="Una pregunta o un pequeño logro…" />
          <div className="flex items-center gap-4 text-sm">
            <label className="flex min-h-11 items-center gap-2"><input type="radio" name="kind" value="question" defaultChecked /> Pregunta</label>
            <label className="flex min-h-11 items-center gap-2"><input type="radio" name="kind" value="quick_win" /> Pequeño logro</label>
          </div>
          <p className="text-sm text-ink-soft">Se publicará con un alias al azar.</p>
          <Button type="submit">Publicar</Button>
        </form>
      </Card>

      <section aria-label="Publicaciones" className="space-y-4">
        {mine.map((p) => (
          <Card key={`u${p.id}`}>
            <p className="text-sm text-ink-soft">{p.alias} · {p.kind === "quick_win" ? "Pequeño logro" : "Pregunta"} · ahora</p>
            <p className="mt-2">{p.text}</p>
          </Card>
        ))}
        {top.map((p) => (
          <div key={p.id} className="space-y-3">
            <Card>
              <p className="text-sm text-ink-soft">
                {p.alias}{p.anonymous ? " · anónima" : ""} · {p.type === "quick_win" ? "Pequeño logro" : "Pregunta"}{p.time ? ` · ${p.time}` : ""}
              </p>
              <p className="mt-2">{p.text}</p>
            </Card>
            {replies(p.id).map((r) => (
              <Card key={r.id} className="ml-6 bg-sage-100">
                <p className="text-sm text-ink-soft">{r.author} · respuesta en audio</p>
                <div className="mt-2 flex items-center gap-3">
                  <button type="button" disabled aria-label="Reproducir (simulado)"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-600 text-white opacity-60">▶</button>
                  <span className="text-sm text-ink-soft">{r.duration} · audio de demostración, no se reproduce</span>
                </div>
                <p className="mt-3 text-sm font-medium">Transcripción</p>
                <p className="mt-1">{r.transcript}</p>
              </Card>
            ))}
          </div>
        ))}
      </section>

      <section aria-label="Consejos" className="space-y-3">
        <h2 className="text-lg font-semibold">Consejos de promotoras</h2>
        {tips.map((t) => (
          <Card key={t.id}>
            <p className="text-xs uppercase tracking-wide text-sage-600">{topic[t.topic] ?? t.topic}</p>
            <h3 className="mt-1 font-semibold">{t.title}</h3>
            <p className="mt-1 text-ink-soft">{t.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

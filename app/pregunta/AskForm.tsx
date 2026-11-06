"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import Card from "@/components/Card";

type Msg = { q: string; a?: string; source?: string; error?: boolean };

export default function AskForm({ page }: { page: string }) {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = text.trim();
    if (!q || busy) return;
    setText("");
    setBusy(true);
    setMsgs((m) => [...m, { q }]);
    let next: Partial<Msg>;
    try {
      const res = await fetch("/api/pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, page }),
      });
      const data = await res.json();
      next = res.ok ? { a: data.answer, source: data.source } : { a: data.error ?? "No pude responder ahora. Inténtalo de nuevo.", error: true };
    } catch {
      next = { a: "No pude responder ahora. Inténtalo de nuevo.", error: true };
    }
    setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, ...next } : x)));
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      {msgs.length === 0 && (
        <p className="text-base leading-relaxed text-ink/70">Escribe lo que te preocupa. Te respondo con calma y te digo de dónde viene la información.</p>
      )}
      <div className="space-y-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className="space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-3xl bg-dawn-400 px-4 py-3 text-white">{m.q}</p>
            {m.a ? (
              <Card className="text-base leading-relaxed">
                <p>{m.a}</p>
                {m.source && <p className="mt-3 text-sm text-ink/60">Fuente: {m.source}</p>}
              </Card>
            ) : (
              <p className="text-sm text-ink/60">Pensando…</p>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="space-y-3">
        <label htmlFor="q" className="sr-only">Tu pregunta</label>
        <textarea
          id="q"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Escribe tu pregunta…"
          className="w-full rounded-3xl border border-dawn-200 bg-white/90 p-4 text-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-dawn-400"
        />
        <Button type="submit" disabled={busy || !text.trim()} className="w-full disabled:opacity-50">
          {busy ? "Un momento…" : "Preguntar"}
        </Button>
      </form>
    </div>
  );
}

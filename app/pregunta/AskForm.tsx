"use client";
import { useState } from "react";
import { Button } from "@/components/Button";
import Card from "@/components/Card";
import { useI18n } from "@/lib/i18n/client";

type Msg = { q: string; a?: string; source?: string; error?: boolean };

export default function AskForm({ page }: { page: string }) {
  const { t } = useI18n();
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
      next = res.ok ? { a: data.answer, source: data.source } : { a: data.error ?? t("ask.error"), error: true };
    } catch {
      next = { a: t("ask.error"), error: true };
    }
    setMsgs((m) => m.map((x, i) => (i === m.length - 1 ? { ...x, ...next } : x)));
    setBusy(false);
  }

  return (
    <div className="space-y-6">
      {msgs.length === 0 && (
        <p className="text-lg text-ink-soft">{t("ask.intro")}</p>
      )}
      <div className="space-y-6" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className="space-y-2">
            <p className="ml-auto w-fit max-w-[85%] rounded-3xl rounded-br-lg bg-dawn-300 px-5 py-3 text-ink">{m.q}</p>
            {m.a ? (
              <Card className="text-base leading-relaxed">
                <p>{m.a}</p>
                {m.source && <p className="mt-3 text-sm text-ink-soft">{t("ask.source")} {m.source}</p>}
              </Card>
            ) : (
              <p className="text-sm text-ink-soft">{t("ask.thinking")}</p>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={send} className="space-y-4">
        <label htmlFor="q" className="sr-only">{t("ask.label")}</label>
        <textarea
          id="q"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder={t("ask.placeholder")}
          className="field text-lg"
        />
        <Button type="submit" disabled={busy || !text.trim()} className="w-full">
          {busy ? t("ask.busy") : t("ask.send")}
        </Button>
      </form>
    </div>
  );
}

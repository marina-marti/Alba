import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { listUserPosts } from "@/lib/simulated";
import { loadDemoCircle } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n/es";
import { publish } from "./actions";

export const dynamic = "force-dynamic";
// Topic values differ per language in the content files (sanar / healing); both map to a dictionary key.
const TOPIC: Record<string, Key> = {
  sanar: "circle.topic.healing", healing: "circle.topic.healing",
  lactancia: "circle.topic.breastfeeding", breastfeeding: "circle.topic.breastfeeding",
  "cuidado de niños": "circle.topic.childcare", childcare: "circle.topic.childcare",
};

export default async function Page() {
  const { lang, t } = await getI18n();
  const { posts, tips } = loadDemoCircle(lang);
  const kindLabel = (k: string) => t(k === "quick_win" ? "circle.quickWin" : "circle.question");
  const mine = listUserPosts();
  const replies = (id: string) => posts.filter((p) => p.reply_to === id);
  const top = posts.filter((p) => !p.reply_to);

  return (
    <div className="space-y-8">
      <h1 className="page-title">{t("circle.title")}</h1>
      <p className="text-lg text-ink-soft">{t("circle.intro")}</p>

      <Card>
        <form action={publish} className="space-y-4">
          <label htmlFor="text" className="font-medium">{t("circle.shareLabel")}</label>
          <textarea id="text" name="text" required maxLength={500} rows={3}
            className="field" placeholder={t("circle.sharePlaceholder")} />
          <div className="flex items-center gap-4 text-sm">
            <label className="flex min-h-11 items-center gap-2"><input type="radio" name="kind" value="question" defaultChecked className="h-5 w-5 accent-sage-600" /> {t("circle.question")}</label>
            <label className="flex min-h-11 items-center gap-2"><input type="radio" name="kind" value="quick_win" className="h-5 w-5 accent-sage-600" /> {t("circle.quickWin")}</label>
          </div>
          <p className="text-sm text-ink-soft">{t("circle.aliasNote")}</p>
          <Button type="submit">{t("circle.publish")}</Button>
        </form>
      </Card>

      <section aria-label={t("circle.postsAria")} className="space-y-5">
        {mine.map((p) => (
          <Card key={`u${p.id}`}>
            <p className="text-sm text-ink-soft">{p.alias} · {kindLabel(p.kind)} · {t("circle.now")}</p>
            <p className="mt-2">{p.text}</p>
          </Card>
        ))}
        {top.map((p) => (
          <div key={p.id} className="space-y-4">
            <Card>
              <p className="text-sm text-ink-soft">
                {p.alias}{p.anonymous ? ` · ${t("circle.anonymous")}` : ""} · {kindLabel(p.type)}{p.time ? ` · ${p.time}` : ""}
              </p>
              <p className="mt-2">{p.text}</p>
            </Card>
            {replies(p.id).map((r) => (
              <Card key={r.id} className="ml-6 !bg-sage-50">
                <p className="text-sm text-ink-soft">{r.author} · {t("circle.audioReply")}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button type="button" disabled aria-label={t("circle.playAria")}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-600 text-white opacity-70">▶</button>
                  <span className="text-sm text-ink-soft">{r.duration} · {t("circle.audioNote")}</span>
                </div>
                <p className="mt-3 text-sm font-medium">{t("circle.transcript")}</p>
                <p className="mt-1">{r.transcript}</p>
              </Card>
            ))}
          </div>
        ))}
      </section>

      <section aria-label={t("circle.tipsAria")} className="space-y-5 pt-4">
        <h2 className="font-serif text-2xl">{t("circle.tipsTitle")}</h2>
        {tips.map((tip) => (
          <Card key={tip.id}>
            <p className="text-xs uppercase tracking-widest text-sage-700">{TOPIC[tip.topic] ? t(TOPIC[tip.topic]) : tip.topic}</p>
            <h3 className="mt-2 text-lg font-semibold">{tip.title}</h3>
            <p className="mt-1 text-ink-soft">{tip.text}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

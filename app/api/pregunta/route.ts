import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/ask-alba";
import { makeGenerate } from "@/lib/claude-generate";
import { getI18n } from "@/lib/i18n/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { t } = await getI18n(); // UI language only for error messages; the answer follows the question (REQ-35)
  let body: { question?: unknown; page?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: t("api.invalid") }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  const page = typeof body.page === "string" ? body.page.trim().slice(0, 80) : "";
  if (!question) return NextResponse.json({ error: t("api.empty") }, { status: 400 });
  const r = await answerQuestion({ question, page }, { generate: process.env.CLAUDE_API_KEY ? makeGenerate() : null });
  return NextResponse.json({ answer: r.answer, source: r.source, usedSeed: r.usedSeed });
}

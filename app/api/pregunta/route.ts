import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/ask-alba";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { question?: unknown; page?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
  const page = typeof body.page === "string" ? body.page.trim().slice(0, 80) : "";
  if (!question) return NextResponse.json({ error: "Escribe tu pregunta." }, { status: 400 });
  const r = await answerQuestion({ question, page });
  return NextResponse.json({ answer: r.answer, source: r.source, usedSeed: r.usedSeed });
}
